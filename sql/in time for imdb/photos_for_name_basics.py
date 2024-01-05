import requests
import csv
yeah="{width_variable}"
# Function to query the API and get the profile path
def get_profile_path(name):
    url = f"https://api.themoviedb.org/3/search/person?query={name.replace(' ', '+')}&api_key=548e9052202183ea3888718b1e4dc4cc"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            first_result = data['results'][0]
            if 'profile_path' in first_result:
                return f"https://image.tmdb.org/t/p/{yeah}{first_result['profile_path']}"
    return None

# Function to process each line of the file
def process_file(input_file_path, output_file_path):
    fetched_urls = {}
    with open(input_file_path, 'r', encoding='utf-8') as infile, \
         open(output_file_path, 'w', encoding='utf-8', newline='') as outfile:

        reader = csv.reader(infile, delimiter='\t')
        writer = csv.writer(outfile, delimiter='\t')

        for row in reader:
            nconst = row[0]
            # Check if img_url_asset is missing or "\N", and if the URL hasn't been fetched before
            if (len(row) < 7 or row[6] == "\\N") and nconst not in fetched_urls:
                fetched_urls[nconst] = get_profile_path(row[1])

            if fetched_urls.get(nconst) and fetched_urls[nconst] != None:
                row.append(fetched_urls[nconst])
            writer.writerow(row)

# Input and output file paths
input_file_path = 'name basics.tsv'
output_file_path = 'updated_name_basics.tsv'

process_file(input_file_path, output_file_path)

print("Processing complete.")
