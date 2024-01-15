import requests
import os
import sys


# Function to get episode details (including backdrop photo) from TMDB using tconst
def get_episode_details_from_tmdb(tconst, api_key, width_variable):
    tmdb_search_url = f"https://api.themoviedb.org/3/find/{tconst}?api_key={api_key}&external_source=imdb_id"
    response = requests.get(tmdb_search_url)
    if response.status_code == 200:
        data = response.json()
        if data['tv_episode_results']:
            episode_details = data['tv_episode_results'][0]
            still_path = episode_details.get('still_path')
            if still_path:
                backdrop_url = f"https://image.tmdb.org/t/p/{width_variable}{still_path}"
                return episode_details, backdrop_url
    return None, None


def line_exists_in_file(file_path, line_to_check):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if line.strip() == line_to_check.strip():
                    return True
    return False

def append_to_existing_files(input_file_path, output_directory, line_to_append, tconst):

    base_name = os.path.basename(input_file_path)
    
    # Ensure that the file name ends with '.tsv' before replacing
    if base_name.endswith(".tsv"):
        output_file_name = base_name[:-4] + "_add.tsv"  # Remove '.tsv' and add '_add.tsv'
    else:
        output_file_name = base_name + "_add.tsv"  # Just add '_add.tsv' if '.tsv' is not present

    output_file_path = os.path.join(output_directory, output_file_name)
    
    # Skip adding the line if it already exists (except for title.principals.tsv)
    if 'title.principals.tsv' not in output_file_path and line_exists_in_file(output_file_path, line_to_append):
        return

    os.makedirs(output_directory, exist_ok=True)

    with open(output_file_path, 'a', encoding='utf-8') as outfile:
        outfile.write(line_to_append)

        
def process_imdb_files(tconst, imdb_files_directory, backdrop_url, output_directory):
    for file in os.listdir(imdb_files_directory):
        if file == "title.episode.tsv" or file == "name.basics.tsv":
            continue
        if file.endswith(".tsv"):
            input_file_path = os.path.join(imdb_files_directory, file)
            with open(input_file_path, 'r', encoding='utf-8') as infile:
                for line in infile:
                    columns = line.split('\t')
                    if any(tconst == column.strip() for column in columns):
                        if 'title.basics.tsv' in input_file_path:
                            line = line.strip() + '\t' + backdrop_url + '\n'
                        append_to_existing_files(input_file_path, output_directory, line, tconst)

def main():
    if len(sys.argv) != 3:
        print("Usage: episodes_alot.py <tconst> <output_directory>")
        sys.exit(1)

    tconst = sys.argv[1]
    output_directory = sys.argv[2]

    print(f"Processing episode with tconst {tconst}")

    # Replace with your TMDB API key and local directory path
    tmdb_api_key = "548e9052202183ea3888718b1e4dc4cc"
    imdb_files_directory = "all imdb"
    width_variable = "{width_variable}"  # Example width variable, adjust as needed

    episode_details, backdrop_url = get_episode_details_from_tmdb(tconst, tmdb_api_key, width_variable)

    if backdrop_url:
        process_imdb_files(tconst, imdb_files_directory, backdrop_url, output_directory)

    print(f"Processed IMDb files for episode with tconst {tconst}")

if __name__ == "__main__":
    main()
