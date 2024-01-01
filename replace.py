import os
import sys

def replace_in_file(file_path, old_string, new_string):
    with open(file_path, 'r', encoding='utf-8') as file:
        filedata = file.read()

    filedata = filedata.replace(old_string, new_string)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(filedata)

def main():
    if len(sys.argv) not in [2, 3]:
        print("Usage: python script.py <ip_address> [localhost]")
        sys.exit(1)

    ip_address = sys.argv[1]
    replace_localhost = len(sys.argv) == 2
    target_extensions = {'.html', '.js', '.py'}

    for root, dirs, files in os.walk('.'):
        for file in files:
            if file == 'replace.py':
                continue
            if file == 'database.js':
                continue
            if file.endswith(tuple(target_extensions)):
                file_path = os.path.join(root, file)
                if replace_localhost:
                    replace_in_file(file_path, 'localhost', ip_address)
                else:
                    replace_in_file(file_path, ip_address, 'localhost')

if __name__ == "__main__":
    main()
