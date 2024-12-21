import os
import time
import socket
import json
import pyautogui
import psutil
import logging
import datetime
import gc

from PIL import Image
from cryptography.fernet import Fernet
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from filelock import FileLock

# Constants
# Ris drive id. Remove it
MY_ADMIN_FOLDER_ID = "17ceO5divwXea1vD6qUPxiLvyIUUAOlHc" 
TEMP_DIR = "SysFiles\Ssimgs"
ENCRYPTED_KEY_FILE = "service-account-key.enc"
ENCRYPTION_KEY_FILE = "encryption_key.key"
SCREENSHOT_SETTINGS_FILE = "admin_settings.json"
IMG_UPLOAD_RETRY_INTERVAL = 5 
INTERNET_RETRY_INTERVAL = 20
INTERNET_MAX_RETRIES = 100
INTERNET_RETRY_COUNT = 0


logging.basicConfig(filename="app_errors.log", level=logging.ERROR, 
                    format="%(asctime)s - %(levelname)s - %(message)s")

def log_error(e):
    logging.error("An error occurred", exc_info=e)


"""
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Example usage:
logging.info("Screenshot saved to: %s", output_file)

"""

# Utility Functions

def is_connected():
    """Check if the system is connected to the internet."""
    try:
        # Attempt to connect to a common server (e.g., Google DNS)
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False


def decrypt_service_account_key():
    with open(ENCRYPTION_KEY_FILE, "rb") as key_file:
        encryption_key = key_file.read()
    cipher = Fernet(encryption_key)
    with open(ENCRYPTED_KEY_FILE, "rb") as enc_file:
        encrypted_data = enc_file.read()
    decrypted_data = cipher.decrypt(encrypted_data)
    print(f"Decrypted key: {decrypted_data}")
    decrypted_key = json.loads(decrypted_data.decode("utf-8"))
    return decrypted_key


def authenticate_google_drive(decrypted_key):
    """Authenticate with Google Drive using the decrypted service account key."""
    try:
        credentials = Credentials.from_service_account_info(
            decrypted_key, scopes=["https://www.googleapis.com/auth/drive"]
        )
        drive_service = build("drive", "v3", credentials=credentials)
        return drive_service
    except Exception as e:
        print(f"Google Drive authentication failed: {e}")
        return None


def fetch_settings():
    """Fetch screenshot settings from admin's JSON settings file."""
    default_settings = {
        "allow_screenshots": True,
        "screenshot_interval": 10,
        "image_type": "jpg",
        "image_quality": 300,
    }

    try:
        with open(SCREENSHOT_SETTINGS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Settings file '{SCREENSHOT_SETTINGS_FILE}' not found. Using default settings.")
    except json.JSONDecodeError:
        print(f"JSON decoding error in settings file. Using default settings.")
    except Exception as e:
        print(f"Unexpected error while fetching settings: {e}")

    return default_settings


def get_or_create_employee_folder(drive_service, admin_folder_id):

    hostname = socket.gethostname()
    query = (
        f"mimeType='application/vnd.google-apps.folder' and "
        f"name='{hostname}' and '{admin_folder_id}' in parents"
    )
    response = drive_service.files().list(q=query, fields="files(id, name)").execute()
    files = response.get("files", [])
    if files:
        folder_id = files[0]["id"]
        print(f"Folder '{hostname}' already exists with ID: {folder_id}")
        return folder_id

    print(f"Folder '{hostname}' does not exist. Creating a new folder...")
    file_metadata = {
        "name": hostname,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [admin_folder_id],
    }
    folder = drive_service.files().create(body=file_metadata, fields="id, name").execute()
    print(f"Created folder '{folder['name']}' with ID: {folder['id']}")
    return folder["id"]


def capture_screenshot(output_file):
    """
    Capture a screenshot and save it to the specified file.
    :param output_file: Path to save the screenshot.
    """
    screenshot = pyautogui.screenshot()
    screenshot.save(output_file)  # Directly save the screenshot to the file
    print(f"Screenshot saved to: {output_file}")


def compress_image(input_file, output_file, max_size_kb):
    """
    Compress an image to ensure it is below the max size.
    Writes to a temporary file first, then replaces the original if successful.
    """
    temp_compressed_file = output_file + ".tmp"  # Temporary file

    with Image.open(input_file) as image:
        image = image.convert("RGB")  # Ensure compatibility
        quality = 85  # Start with high quality
        while True:
            image.save(temp_compressed_file, format="JPEG", quality=quality)
            if os.path.getsize(temp_compressed_file) / 1024 <= max_size_kb or quality <= 10:
                break
            quality -= 5  # Decrease quality incrementally

    # Replace the original file with the compressed version
    os.replace(temp_compressed_file, output_file)
    print(f"Compressed image saved to: {output_file}")


def check_file_access(file_path):
    """Check which processes are using the file."""
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            for file in proc.open_files():
                if file.path == file_path:
                    print(f"File {file_path} is being used by process {proc.info['name']} (PID {proc.info['pid']}).")
        except Exception:
            pass


def wait_for_file_release(file_path, timeout=10):
    """Wait for the file to be released by any other process."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with open(file_path, "rb"):
                return  # File is released
        except IOError:
            time.sleep(1)
    raise TimeoutError(f"File {file_path} is still in use after {timeout} seconds.")


def wait_for_file_stability(file_path, timeout=10):
    """
    Wait until the file size stabilizes, indicating that it is no longer being written to.
    :param file_path: Path to the file being monitored.
    :param timeout: Maximum time to wait for file stability (in seconds).
    :raises TimeoutError: If the file is not stable within the timeout.
    """
    stable = False
    retries = 0
    max_retries = 20
    start_time = time.time()

    while not stable and retries < max_retries:
        # Check the initial size
        initial_size = os.path.getsize(file_path)
        time.sleep(1)  # Wait for 1 second
        # Check the size again
        current_size = os.path.getsize(file_path)

        # If sizes match, the file is stable
        stable = (initial_size == current_size)
        retries += 1
        
        # If timeout is exceeded, raise an error
        if time.time() - start_time > timeout:
            raise TimeoutError(f"File {file_path} is not stable after {timeout} seconds.")

daily_folder_cache = {}

def get_or_create_daily_folder(drive_service, pc_folder_id):
    """Retrieve or create a daily folder in Google Drive."""
    
    # Get the current date in "Day - dd/mm/yy" format
    current_date = datetime.datetime.now().strftime("Day - %d.%m.%y")
    if current_date in daily_folder_cache:
        return daily_folder_cache[current_date]
    
    # Check if the folder already exists
    query = f"'{pc_folder_id}' in parents and name='{current_date}' and mimeType='application/vnd.google-apps.folder'"
    response = drive_service.files().list(q=query, fields="files(id, name)").execute()
    files = response.get("files", [])
    if files:
        print(f"Daily folder '{current_date}' already exists.")
        daily_folder_cache[current_date] = files[0]["id"]
        return files[0]["id"]

    # Create the folder if it doesn't exist
    print(f"Creating daily folder: {current_date}")
    folder_metadata = {
        "name": current_date,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [pc_folder_id],
    }
    folder = drive_service.files().create(body=folder_metadata, fields="id, name").execute()
    print(f"Created daily folder '{folder['name']}' with ID: {folder['id']}")
    daily_folder_cache[current_date] = folder["id"]
    return folder["id"]


def upload_file(drive_service, folder_id, file_path):
    """Upload a file directly to Google Drive after ensuring file readiness."""

    if not is_connected():
        print(f"No internet connection. Skipping upload for now: {file_path}")
        return  # Leave the file in the Screenshots folder

    try:
        print(f"Ensuring file is ready for upload: {file_path}")
        
        # Ensure the file is stable and not in use
        wait_for_file_stability(file_path)
        wait_for_file_release(file_path)

        # Upload the file
        print(f"Uploading file to Google Drive: {file_path}")
        media = MediaFileUpload(file_path, resumable=True)
        file_metadata = {
            'name': os.path.basename(file_path),
            'parents': [folder_id]
        }
        drive_service.files().create(body=file_metadata, media_body=media).execute()
        print(f"Uploaded '{file_path}' successfully!")
        
        # Wait briefly before deleting
        time.sleep(1)  # Ensure any lingering locks are released
        
        
        # Wait for file release and force garbage collection
        wait_for_file_release(file_path)
        # gc.collect()  # Force garbage collection

        # Clean up temporary files
        print(f"Deleting local file: {file_path}")
        
        # Clean up temporary files
        if os.path.exists(file_path):
            print(f"Deleting local file: {file_path}")
            try:
                os.remove(file_path)
                print(f"Deleted local file: {file_path}")
            except Exception as e:
                print(f"Error deleting file '{file_path}': {e}")
                check_file_access(file_path)  # Debug access issues
        
    except Exception as e:
        print(f"Upload failed: {e}. Retrying in {IMG_UPLOAD_RETRY_INTERVAL} seconds.")
        check_file_access(file_path)  # Debug file access issues
        time.sleep(IMG_UPLOAD_RETRY_INTERVAL)
        upload_file(drive_service, folder_id, file_path)  # Retry on failure


def process_pending_uploads(drive_service, folder_id):
    """Process files in the Screenshots folder that are pending upload."""
    if not os.path.exists(TEMP_DIR):
        return

    for file_name in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, file_name)
        try:
            if is_connected():
                print(f"Processing file for upload: {file_path}")
                upload_file(drive_service, folder_id, file_path)
        except Exception as e:
            print(f"Failed to upload file '{file_path}': {e}")



def periodic_screenshot(drive_service, pc_folder_id):
    """Capture and upload screenshots, organizing them in daily folders."""
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)

    while True:
               
        # Step 1: Process any pending uploads
        process_pending_uploads(drive_service, pc_folder_id)

        # Step 2: Fetch settings
        settings = fetch_settings()
        if not settings or not settings.get("allow_screenshots", False):
            print("Screenshots disabled. Retrying in 60 seconds.")
            time.sleep(60)
            continue
        # Step 3: Capture a new screenshot
        interval = settings.get("screenshot_interval", 10)
        image_type = settings.get("image_type", "jpg")
        max_size_kb = settings.get("image_quality", 300)

        try:
            # Generate unique file names
            timestamp = datetime.datetime.now()
            file_name = timestamp.strftime("Img - %d.%m.%y - %I.%M.%S %p") + f".{image_type}"
            temp_file = os.path.join(TEMP_DIR, file_name)

            # Capture screenshot
            print(f"Capturing screenshot: {temp_file}")
            capture_screenshot(temp_file)

            # Ensure file stability
            print("Waiting for file stability...")
            wait_for_file_stability(temp_file)

            # Compress the screenshot
            print(f"Compressing screenshot: {temp_file} -> {temp_file}")
            compress_image(temp_file, temp_file, max_size_kb)

            # Ensure compressed file stability and release
            wait_for_file_stability(temp_file)
            wait_for_file_release(temp_file)

            # Get or create the daily folder
            daily_folder_id = get_or_create_daily_folder(drive_service, pc_folder_id)

            # Upload the file
            print(f"Uploading screenshot to Google Drive: {temp_file}")
            upload_file(drive_service, daily_folder_id, temp_file)
            # wait_for_file_release(temp_file)
            # gc.collect()
            
            # Clean up temporary files
            print(f"Deleting temporary files: {temp_file}, {temp_file}")
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except Exception as e:
                    print(f"Failed to delete temp_file '{temp_file}': {e}")
           
        except TimeoutError as te:
            print(f"File stability timeout: {te}")
        except Exception as e:
            print(f"Error during screenshot processing: {e}")
            check_file_access(temp_file)  # Debug locked file

        print(f"Waiting for {interval} seconds before the next capture...")
        time.sleep(interval)


# Main Function
if __name__ == "__main__":
    try:
        print("Starting the employee app...")

        # Step 1: Decrypt the service account key
        print("Decrypting the service account key...")
        decrypted_key = decrypt_service_account_key()

        print("Authenticating with Google Drive...")
        INTERNET_RETRY_COUNT = 0
        
        # Step 2: Authenticate with Google Drive
        print("Authenticating with Google Drive...")
        while INTERNET_RETRY_COUNT < INTERNET_MAX_RETRIES:
            drive_service = authenticate_google_drive(decrypted_key)
            if not drive_service:
                INTERNET_RETRY_COUNT += 1
                print(f"Authentication failed. Attempt {INTERNET_RETRY_COUNT}/{INTERNET_MAX_RETRIES}. "f"Retrying in {INTERNET_RETRY_INTERVAL} seconds...")
                time.sleep(INTERNET_RETRY_INTERVAL)
                continue
            else:
                print("Successfully authenticated with Google Drive.")
                INTERNET_RETRY_COUNT = 0  # Reset retry count
                break

        else:  # Executes if while loop completes without breaking
                print("Maximum retries reached. Exiting.")
                sys.exit(1)  # Exit the application


        # Step 3: Retrieve or create the employee-specific folder
        admin_folder_id = MY_ADMIN_FOLDER_ID  # Replace with actual admin folder ID
        pc_folder_id = get_or_create_employee_folder(drive_service, admin_folder_id)

        # Step 4: Start periodic screenshot capture
        print("Starting periodic screenshot capture...")
        periodic_screenshot(drive_service, pc_folder_id)

    except Exception as e:
        log_error(e)
        print(f"An unexpected error occurred: {e}")
        input("Press Enter to exit...")  # Prevent immediate CMD window closure




