import json
import os
import re
import zipfile


def run_survey():
    data = {
        "answers": {
            "phase": ["requirements gathering", "requirements specification", "architecture", "design", "coding", "testing", "deployment"],
            "action": ["problem understanding", "stakeholder statement", "requirements (functional)", "requirements (non-functional)", "use case specification", "architectural decision", "design decision", "data design", "source code authoring", "unit testing", "functional testing", "integration testing", "performance testing", "other testing", "dev-ops", "vm operations", "container operations", "network operations", "code management"],
            "scope": ["documentation (text)", "uml activity", "uml sequence", "uml component", "uml deployment", "uml class", "uml other", "database design", "frontend", "data management", "backend", "api", "cli", "test cases", "test code driver", "test execution scripts", "deployment scripts", "code management actions"],
            "action experience": ["big", "fair", "little", "none"],
            "prog lang": ["n/a", "js", "js-node", "python", "sql", "nosql db", "java", "other"],
            "other prog lang": "<fill in>",
            "tool": ["chat gpt 3.x", "chat gpt 4.x", "bard", "github copilot", "scribe", "intellij IDEA", "other"],
            "other tool": "<fill in>",
            "tool option": ["free", "free trial", "full"],
            "tool experience": ["none", "some", "enough", "master"],
            "time allocated (h)": "<fill in>",
            "time saved estimate (h)": "<fill in>", 
            "quality of ai help": ["ready-to-use", "minor modifications needed", "major modifications needed", "unusable"],
            "generic feeling": ["great as-is", "great in the future", "needs work", "makes not sense"],
            "notes": "<fill in>"
        }
    }

    responses = {}
    max_length=0
    for key, options in data["answers"].items():
        print()
        if options == "<fill in>":
            response = input(f"Enter your response for {key}: ")
            if len(response) == 0:
                response="<fill in>"
        else:
            title = f"Choose an option for {key}:"
            print(title)
            for _ in title: 
                print("_",end="")
            print()
            for i, option in enumerate(options, start=1):
                choice_for_user = (f"{option} ({i})")
                print(choice_for_user)
                if len(choice_for_user)>max_length:
                    max_length=len(choice_for_user)
            for grammi in range(max_length):
                print("_",end="")
            print()
            choice = int(input("Your choice (number): "))
            response = options[choice - 1]
        
        responses[key] = response
        print()

    return responses

def get_next_filename(phase, directory="."):
    pattern = re.compile(rf"zipped_{phase}_(\d+).zip")
    max_order = 0

    for filename in os.listdir(directory):
        match = pattern.match(filename)
        if match:
            order = int(match.group(1))
            max_order = max(max_order, order)

    next_order = max_order + 1
    return f"{phase}_{next_order}.json"

def log_chat(filename):
    print("If you dont want a prompt write \"No prompt\"")
    chat_log_path = input("Enter the name of your log file (without .txt): ")
    #chat_log_path="logger.txt"
    if chat_log_path == "No prompt":
        return False
    chat_log_path+=".txt"
    try:
        with open(chat_log_path, 'r', encoding='utf-8') as chat_file:
            lines = chat_file.readlines()
    except FileNotFoundError:
        print("File not found. Please check the path and try again.")
        return True
    

    log_filename = f"prompt_{filename}.txt"

    with open(log_filename, "w", encoding='utf-8') as file:
        for line in lines:
            if line.strip() == "User":
                file.write("User:\n")
                file.write("______\n")
                continue
            if line.strip() == "ChatGPT":
                file.write("ChatGPT:\n")
                file.write("_________\n")
                continue
            file.write(line)

    print(f"Chat log saved to {log_filename}")
    return True


def zip_files(zip_filename, files_to_zip):
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            zipf.write(file)


responses = run_survey()

phase = responses.get("phase").replace(" ", "_").lower()  # Replace spaces with underscores and convert to lower case
filename = get_next_filename(phase)

# Save JSON responses
with open(filename, "w", encoding='utf-8') as file:
    json.dump({"answers": responses}, file, indent=4)
print(f"Responses saved to {filename}")

# Generate prompt filename with correct extension
prompt = f"prompt_{filename[:-5]}.txt"
done = log_chat(filename[:-5])  # Pass the base filename without .json extension

# Zip the files
if done:
    zip_files(f"zipped_{filename[:-5]}.zip", [filename, prompt])
    
    
    try:
        os.remove(filename)
        os.remove(prompt)
        print("Files successfully deleted.")
    except FileNotFoundError:
        print("One or both files not found. They may have already been deleted or never existed.")

    
else:
    zip_files(f"zipped_{filename[:-5]}.zip", [filename])
    
    try:
        os.remove(filename) 
        print("File successfully deleted.")
    except FileNotFoundError:
        print("Files not found. It may have already been deleted or never existed.")


print("Visit galileo.softlab.ntua.gr:3001 to submit the zipped file")