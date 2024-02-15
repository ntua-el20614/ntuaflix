import csv
import json
import os

# Define the base path for your files
base_path = r'C:\Users\Iraklis\OneDrive\Desktop\ntuaflix\ntuaflix\cli\cli_posts'

# Specify the filenames
tsv_filename = 'title_ratings_add.tsv'  # Replace 'your_file_name.tsv' with your actual TSV filename
csv_filename = tsv_filename.replace('.tsv', '.csv')
json_filename = tsv_filename.replace('.tsv', '.json')

# Full paths for the files
tsv_file_path = os.path.join(base_path, tsv_filename)
csv_file_path = os.path.join(base_path, csv_filename)
json_file_path = os.path.join(base_path, json_filename)

# Initialize a list to hold all rows of data
data = []

# Read from TSV
with open(tsv_file_path, 'r', newline='', encoding='utf-8') as tsvfile:
    tsv_reader = csv.DictReader(tsvfile, delimiter='\t')
    for row in tsv_reader:
        data.append(row)

# Write to CSV
with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)

# Write to JSON
with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=4)
