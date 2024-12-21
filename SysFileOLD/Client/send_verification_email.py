import jwt
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from datetime import timezone
import os

SECRET_KEY = "YOUR_SECRET_KEY"

# Step 1: Generate Verification Token
def generate_verification_token(email):
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=30)  # Token valid for 30 minutes
    token = jwt.encode({"email": email, "exp": expiration_time}, SECRET_KEY, algorithm="HS256")
    return token

# Step 2: Send Verification Email
def send_verification_email(email):
    verification_token = generate_verification_token(email)
    verification_link = f"http://yourdomain.com/verify?token={verification_token}"

    # Setting up the SMTP server
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "bhadushopping@gmail.com"  # Replace with your email address
    smtp_password = "dlok oftk kanj qtba"  # Replace with your email password or app-specific password

    try:
        # Create the email message
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = email
        msg["Subject"] = "Admin Email Verification"
        body = f"Click the following link to verify your email address:\n\n{verification_link}"
        msg.attach(MIMEText(body, "plain"))

        # Connect to SMTP server and send email
        server = smtplib.SMTP(host=smtp_host, port=smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()

        print("Verification email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Step 3: Retrieve Email and Send Verification
def verify_email_step():
    if not os.path.exists("admin_email.txt"):
        print("No admin email found. Please set it up first.")
        return

    # Retrieve email from file
    with open("admin_email.txt", "r") as file:
        email = file.read().strip()

    # Send verification email
    send_verification_email(email)

if __name__ == "__main__":
    verify_email_step()
