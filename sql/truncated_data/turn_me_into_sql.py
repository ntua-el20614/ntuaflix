import csv
import os

# Define the mapping of TSV files to their corresponding table names and columns
file_table_mappings = {
    'truncated_name.basics.tsv': ('people', ['nconst', 'primaryName', 'birthYear', 'deathYear', 'primaryProfession', 'knownForTitles', 'img_url_asset']),
    'truncated_title.basics.tsv': ('Titles', ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult', 'startYear', 'endYear', 'runtimeMinutes', 'genres', 'img_url_asset']),
    'truncated_title.episode.tsv': ('Episodes', ['tconst', 'parentTconst', 'seasonN', 'episodeN']),
    'truncated_title.ratings.tsv': ('Title_ratings', ['titleid', 'averageRate', 'numVotes']),
    'truncated_title.crew.tsv': ('title_crew', ['tconst', 'directors', 'writers']),
    'truncated_title.principals.tsv': ('title_principals', ['tconst', 'ordering', 'nconst', 'category', 'job', 'characters', 'img_url_asset']),
    'truncated_title.akas.tsv': ('title_akas', ['tconst', 'ordering', 'title', 'region', 'language', 'types', 'attributes', 'isOriginalTitle'])

}

# Function to process special values
def process_special_value(value, col_name):
    if value == r'\N':
        return 'NULL'
    if col_name in ['isAdult', 'isOriginalTitle']:
        return 'TRUE' if value == '1' else 'FALSE' if value == '0' else value
    # Escape single quotes for SQL
    return "'" + value.replace("'", "''") + "'"

# Function to create SQL INSERT statements from TSV data
def create_insert_statements(filename, table, columns):
    insert_statements = []
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t', fieldnames=columns)

        next(reader)  # Skip header row

        for row in reader:
            # Skip rows with missing key fields
            if r'\N' in [row[col] for col in ['tconst', 'nconst'] if col in row]:
                continue

            # Prepare values and create the INSERT statement
            values = [process_special_value(row[col], col) for col in columns]
            insert_statement = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(values)});"
            insert_statements.append(insert_statement)

    return insert_statements

# Main process
sql_statements = []
for filename, (table, columns) in file_table_mappings.items():
    try:
        sql_statements += create_insert_statements(filename, table, columns)
    except Exception as e:
        print(f"Error processing {filename}: {e}")

# Define the path for the SQL file
sql_file_path = 'database_inserts.sql'

# Check if the file already exists and delete it if it does
if os.path.exists(sql_file_path):
    os.remove(sql_file_path)

# Write the SQL statements to a file
with open('database_inserts.sql', 'w', encoding='utf-8') as sql_file:
    sql_file.write('\n'.join(sql_statements))

print("SQL file generated successfully.")
