import jwt
from flask import Flask, request, jsonify
from datetime import datetime, timezone
import platform
import win32cred
import keyring
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

SECRET_KEY = "YOUR_SECRET_KEY"

# Initialize Firebase Firestore
def initialize_firestore():
    if not firebase_admin._apps:
        # Replace with the actual path to your service account key JSON file
        cred = credentials.Certificate("C:\SysFile\Files\service-account-key-firestore-access.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()

# Store the verified email status in Firestore
def save_verification_status_in_firestore(email, db):
    users_ref = db.collection("registered_users")
    query = users_ref.where("email", "==", email).get()
    if query:
        user_ref = query[0].reference
        user_ref.update({"verified": True, "verified_at": firestore.SERVER_TIMESTAMP})

        print(f"Verification status updated for email: {email}")

# Store the verified email securely on the user's system
def store_verified_email(email):
    system_platform = platform.system()

    if system_platform == "Windows":
        store_email_windows(email)
    elif system_platform == "Darwin":  # Darwin is the system name for macOS
        store_email_mac(email)
    else:
        print(f"Platform {system_platform} is not supported for secure storage.")

def store_email_windows(email):
    """ Store email securely in Windows Credential Manager """
    try:
        credential = {
            'Type': win32cred.CRED_TYPE_GENERIC,
            'TargetName': 'EmpApp_AdminEmail',
            'UserName': 'admin_email',
            'CredentialBlob': email,
            'Persist': win32cred.CRED_PERSIST_LOCAL_MACHINE
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

# Verification Endpoint
@app.route('/verify', methods=['GET'])
def verify_email():
    # Get the token from the URL parameters
    token = request.args.get('token')

    if not token:
        return jsonify({"error": "Missing token"}), 400

    try:
        # Decode and validate the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        # Check expiration
        exp = payload.get("exp")
        if datetime.now(timezone.utc).timestamp() > exp:
            return jsonify({"error": "Token has expired"}), 400

        email = payload.get("email")

        # Initialize Firestore
        db = initialize_firestore()

        # Save the verification status in Firestore
        save_verification_status_in_firestore(email, db)

        # Store the email securely since it's verified
        store_verified_email(email)

        return jsonify({"message": f"Email {email} verified, stored securely, and updated in Firestore."}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 400

if __name__ == "__main__":
    app.run(port=5001)
