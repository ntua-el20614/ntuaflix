import os
import sys

def replace_in_file(file_path, old_string, new_string):
    with open(file_path, 'r', encoding='utf-8') as file:
        filedata = file.read()

    filedata = filedata.replace(old_string, new_string)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(filedata)

def main():
    if len(sys.argv) > 3 and len(sys.argv) < 2:
        print("Usage: python script.py <old_string> <new_string>")
        sys.exit(1)
    elif len(sys.argv) == 2 and sys.argv[1]=="go_online":
        
        old_string = "localhost"
        new_string = "uniportal.sytes.net"

    elif len(sys.argv) == 2 and sys.argv[1]=="go_offline":

        old_string = "uniportal.sytes.net"
        new_string = "localhost"
    else:
        old_string = sys.argv[1]
        new_string = sys.argv[2]
    target_extensions = {'.html', '.js', '.py'}

    for root, dirs, files in os.walk('.'):
        for file in files:
            if file == 'replace.py':
                continue
            if file == 'database.js':
                continue
            if file == 'run.py':
                continue
            if file.endswith(tuple(target_extensions)):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, old_string, new_string)

if __name__ == "__main__":
    main()
