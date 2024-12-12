import os
import platform
import keyring
import win32cred

def store_email_windows(email):
    """ Store email securely in Windows Credential Manager """
    try:
        credential = {
            'Type': win32cred.CRED_TYPE_GENERIC,
            'TargetName': 'EmpApp_AdminEmail',
            'UserName': 'admin_email',
            'CredentialBlob': email,  # Do not encode to bytes, pass as string
            'Persist': win32cred.CRED_PERSIST_LOCAL_MACHINE  # Correct Reference
        }
        win32cred.CredWrite(credential, 0)
        print("Email stored successfully in Windows Credential Manager.")
    except Exception as e:
        print(f"Failed to store email in Windows Credential Manager: {e}")

def store_email_mac(email):
    """ Store email securely in macOS Keychain """
    try:
        keyring.set_password("EmpApp", "admin_email", email)
        print("Email stored successfully in macOS Keychain.")
    except Exception as e:
        print(f"Failed to store email in macOS Keychain: {e}")

def store_verified_email(email):
    system_platform = platform.system()

    if system_platform == "Windows":
        store_email_windows(email)
    elif system_platform == "Darwin":  # Darwin is the system name for macOS
        store_email_mac(email)
    else:
        print(f"Platform {system_platform} is not supported for secure storage.")

if __name__ == "__main__":
    if not os.path.exists("admin_email.txt"):
        print("No verified email found. Please verify the email first.")
    else:
        # Read the verified email from the file (as set earlier)
        with open("admin_email.txt", "r") as file:
            email = file.read().strip()

        # Store the verified email securely
        store_verified_email(email)
