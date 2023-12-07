import json
import os
import re

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
    pattern = re.compile(rf"{phase}_(\d+).json")
    max_order = 0

    for filename in os.listdir(directory):
        match = pattern.match(filename)
        if match:
            order = int(match.group(1))
            max_order = max(max_order, order)

    next_order = max_order + 1
    return f"{phase}_{next_order}.json"

responses = run_survey()

phase = responses.get("phase").replace(" ", "_").lower()  # Replace spaces with underscores and convert to lower case
filename = get_next_filename(phase)

with open(filename, "w") as file:
    json.dump({"answers": responses}, file, indent=4)

print(f"Responses saved to {filename}")
print("Visit galileo.softlab.ntua.gr:3001 to submit the file")