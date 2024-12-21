import time
import logging
import tkinter as tk
import threading
import socket
import platform
import uuid
import requests
from datetime import datetime
from firebase_admin import credentials, firestore
import firebase_admin
from send_verification_email import send_verification_email 
from store_verified_email import store_verified_email

# Configure logging
logging.basicConfig(filename='verification_app.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Firebase Firestore
def initialize_firestore():
    if not firebase_admin._apps:
        cred = credentials.Certificate(r"C:\SysFile\Files\service-account-key-firestore-access.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()

# Check if the email is registered in Firestore
def check_email_in_firestore(email, db):
    users_ref = db.collection("registered_users")
    query = users_ref.where("email", "==", email).get()
    if len(query) > 0:
        user_ref = query[0].reference
        user_ref.update({
            "verified_at": firestore.SERVER_TIMESTAMP,
            "verified_count": firestore.Increment(1)
        })
        logging.info(f"Email {email} verified and updated in Firestore.")
        return True
    logging.warning(f"Email {email} not registered in Firestore.")
    return False

# Function to update the admin PC list in Firestore
def update_admin_pc_list(email, pc_alias, db):
    pc_list_ref = db.collection("admin_pc_list").document(email)
    os_version = platform.platform()
    hwid = str(uuid.getnode())
    uuid_str = str(uuid.uuid4())
    current_time = datetime.utcnow()
    location = get_location()
    pc_name = get_pc_name()

    pc_list_ref.set({
        "pc_name": firestore.ArrayUnion([pc_name]),
        "pc_alias": firestore.ArrayUnion([pc_alias]),
        "os_version": os_version,
        "hwid": hwid,
        "uuid": uuid_str,
        "verified_at": current_time,
        "location": location
    }, merge=True)

# Function to get the PC name
def get_pc_name():
    return socket.gethostname()

# Function to sanitize PC alias
def sanitize_pc_alias(alias):
    return re.sub(r'[\\/:*?"<>|]', '-', alias)
    
    # Function to get the location based on IP
def get_location():
    try:
        response = requests.get("https://ipinfo.io", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("city", "Unknown") + ", " + data.get("country", "Unknown")
    except requests.RequestException:
        pass
    return "Unknown"


# Function that executes all the verification steps
def start_verification(email):
    try:
        # Step 1: Verifying Purchase
        db = initialize_firestore()
        if not check_email_in_firestore(email, db):
            processing_label.config(text="Failed - Email not registered.")
            processing_label.update()
            return

        # Step 2: Sending Verification Email
        send_verification_email(email)
        logging.info(f"Verification email sent to {email}.")
        processing_label.config(text="Please check your mail and click the verification link")
        processing_label.update()

        # Step 3: Update the admin PC list
        sanitized_pc_alias = sanitize_pc_alias(pc_alias)
        update_admin_pc_list(email, sanitized_pc_alias, db)
        
        # Start polling to check the verification status
        show_loading_animation()  # Start loading animation
        verify_thread = threading.Thread(target=poll_verification_status, args=(email,))
        verify_thread.start()

    except Exception as e:
        # Handle any exception and update the label to indicate failure
        logging.error(f"Verification process failed: {str(e)}")
        processing_label.config(text=f"Failed - Verification failed: {str(e)}")
        processing_label.update()

# Function to poll the backend to check if the email has been verified successfully
def poll_verification_status(email):
    verification_successful = False

    # Keep checking until verification is confirmed
    while not verification_successful:
        try:
            response = requests.get(f'http://localhost:5001/check_verification_status?email={email}')
            if response.status_code == 200 and response.json().get('verified', False):
                verification_successful = True
                logging.info(f"Email {email} verification successful.")
        except requests.RequestException as e:
            # If there's an issue with the request, log the error and retry after delay
            logging.error(f"Error while polling verification status: {str(e)}")

        time.sleep(5)  # Poll every 5 seconds

    # Once verified, store the email securely
    store_verified_email(email)
    logging.info(f"Verified email {email} stored securely.")

    # Update the message and stop the loading animation
    stop_loading_animation()
    processing_label.config(text="All set. Now you can close this window.")
    processing_label.update()

# Function to show a loading animation during the polling process
def show_loading_animation():
    processing_label.config(text="...")
    progress_label.pack()

# Function to stop the loading animation
def stop_loading_animation():
    progress_label.pack_forget()

# Function called on submit to start the verification process
def submit_email():
    email = email_entry.get().strip()
    pc_alias = pc_alias_entry.get().strip()
    if "@" not in email or "." not in email:
        processing_label.config(text="Invalid Email. Please enter a valid email address.")
        logging.warning("Invalid email address entered.")
        return

    # Start verification process in a new thread
   
    verify_thread = threading.Thread(target=start_verification, args=(email,))
    verify_thread.start()

# Tkinter window setup
root = tk.Tk()
root.title("Admin Email Setup")
root.geometry("600x450")

# Create the label and entry for email input
label = tk.Label(root, text="Please enter your (admin) email address:")
label.pack(pady=10)

email_entry = tk.Entry(root, width=50)
email_entry.pack(pady=5)

# Create the label and entry for PC alias input
alias_label = tk.Label(root, text="Please enter an alias name for this PC (e.g., Office-PC or Manager-PC or PC-Kid-1):")
alias_label.pack(pady=10)

pc_alias_entry = tk.Entry(root, width=50)
pc_alias_entry.pack(pady=5)

# Create a submit button
submit_button = tk.Button(root, text="Submit", command=submit_email)
submit_button.pack(pady=10)

# Label to show permanent instructions
instructions_label = tk.Label(root, text=(
    "1. Enter your (admin) email in the above textbox.\n"
    "2. Click the above submit button and wait for some time.\n"
    "3. Open your Gmail and verify the link from our email.\n"
    "4. All set. Close this window."
))
instructions_label.pack(pady=10)

# Label to show processing messages
processing_label = tk.Label(root, text="")
processing_label.pack(pady=5)

# Label to show a progress indicator (loading animation)
progress_label = tk.Label(root, text="...", font=("Helvetica", 10, "italic"))

# Tkinter main loop
root.mainloop()
