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
            print("",end="")
        else:
            print("",end="")

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
            print("",end="")

    try:
        shutil.rmtree(f"../sql/update/{folder_path}")

    except Exception as e:
        print("",end="")


if __name__ == "__main__":
    if len(sys.argv) < 2:

        sys.exit(1)

    folder_path = sys.argv[1]
    secret_key = '3141592653589793236264'
    is_user_admin = 'true'
    main(folder_path, secret_key, is_user_admin)
