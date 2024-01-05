import os
import sys

def replace_in_file(file_path, old_string, new_string):
    with open(file_path, 'r', encoding='utf-8') as file:
        filedata = file.read()

    filedata = filedata.replace(old_string, new_string)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(filedata)

def main():
    if len(sys.argv) != 3:
        print("Usage: python script.py <old_string> <new_string>")
        sys.exit(1)

    old_string = sys.argv[1]
    new_string = sys.argv[2]
    target_extensions = {'.html', '.js', '.py'}

    for root, dirs, files in os.walk('.'):
        for file in files:
            if file == 'replace.py':
                continue
            if file == 'database.js':
                continue
            if file.endswith(tuple(target_extensions)):
                file_path = os.path.join(root, file)
                replace_in_file(file_path, old_string, new_string)

if __name__ == "__main__":
    main()
