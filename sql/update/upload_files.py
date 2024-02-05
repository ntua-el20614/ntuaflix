import requests
import sys
import os
import shutil

def upload_file(endpoint_url, file_path, secret_key, is_user_admin):
    
    with open(file_path, 'rb') as file:
        files = {'file': (os.path.basename(file_path), file)}
        data = {'secretKey': secret_key, 'is_user_admin': is_user_admin}
        response = requests.post(endpoint_url, files=files, data=data)
        if response.status_code == 200:
            print(f"Successfully uploaded {file_path} to {endpoint_url}")
        else:
            print(f"Failed to upload {file_path}. Status code: {response.status_code}, Response: {response.text}")

def main(folder_path, secret_key, is_user_admin):
    # Map of file names to their corresponding upload endpoint URLs
    file_to_endpoint = {
        'title.basics_add.tsv':     'http://localhost:7117/admin/upload/titlebasics',
        'title.akas_add.tsv':       'http://localhost:7117/admin/upload/titleakas',
        'name.basics_add.tsv':      'http://localhost:7117/admin/upload/namebasics',
        'title.crew_add.tsv':       'http://localhost:7117/admin/upload/titlecrew',
        'title.episode_add.tsv':    'http://localhost:7117/admin/upload/titleepisode',
        'title.principals_add.tsv': 'http://localhost:7117/admin/upload/titleprincipals',
        'title.ratings_add.tsv':    'http://localhost:7117/admin/upload/titleratings',
    }

    for file_name, endpoint_url in file_to_endpoint.items():
        file_path = os.path.join(f"../sql/update/{folder_path}", file_name)
        if os.path.exists(file_path):
            upload_file(endpoint_url, file_path, secret_key, is_user_admin)
        else:
            print(f"File not found: {file_path}")

    try:
        shutil.rmtree(f"../sql/update/{folder_path}")
        print(f"Successfully deleted the folder: {folder_path}")
    except Exception as e:
        print(f"Error deleting the folder: {folder_path}. Exception: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload_files.py <folder_path>")
        sys.exit(1)

    folder_path = sys.argv[1]
    secret_key = '3141592653589793236264'
    is_user_admin = 'true'
    main(folder_path, secret_key, is_user_admin)
