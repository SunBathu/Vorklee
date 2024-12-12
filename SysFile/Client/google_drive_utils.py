# google_drive_utils.py
from googleapiclient.discovery import build

def list_screenshots(drive_service, folder_id):
    """List files in a specific Google Drive folder."""
    try:
        response = drive_service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields="files(id, name, mimeType, createdTime, webViewLink)",
        ).execute()
        return response.get("files", [])
    except Exception as e:
        print(f"Error listing screenshots: {e}")
        return []
