import requests
import os
import sys
import subprocess

# Replace with your TMDB API key and local directory path
tmdb_api_key = "548e9052202183ea3888718b1e4dc4cc"
imdb_files_directory = "all imdb"  
width_variable = "{width_variable}"

def get_tv_series_details_from_tmdb(tconst, api_key):
    tmdb_search_url = f"https://api.themoviedb.org/3/find/{tconst}?api_key={api_key}&external_source=imdb_id"
    response = requests.get(tmdb_search_url)
    if response.status_code == 200:
        data = response.json()
        if data['tv_results']:
            tv_series_details = data['tv_results'][0]
            backdrop_path = tv_series_details.get('poster_path')
            if backdrop_path:
                backdrop_url = f"https://image.tmdb.org/t/p/{width_variable}{backdrop_path}"
                return tv_series_details, backdrop_url
    return None, None

        
def search_in_imdb_files_with_photo(tconst, imdb_files_directory, backdrop_url, output_directory):
    for file in os.listdir(imdb_files_directory):
        if file.endswith(".tsv"):
            input_file_path = os.path.join(imdb_files_directory, file)
            output_file_name = file.split('.')[0]+"."+file.split('.')[1] + '_add.tsv'
            output_file_path = os.path.join(output_directory, output_file_name)
            with open(input_file_path, 'r', encoding='utf-8') as infile, open(output_file_path, 'w', encoding='utf-8') as outfile:
                headers = infile.readline()  # Read the header line
                outfile.write(headers)  # Write the header line to the output file
                for line in infile:
                    columns = line.split('\t')
                    if any(tconst == column.strip() for column in columns):
                        if 'title.basics.tsv' in input_file_path:
                            line = line.strip() + '\t' + backdrop_url + '\n'
                        outfile.write(line)


def create_directory_for_tconst(tconst):
    directory_name = os.path.join('.', tconst)
    if not os.path.exists(directory_name):
        os.makedirs(directory_name)
    return directory_name

def get_episodes_list(parent_tconst, imdb_files_directory):
    episodes = []
    # Assuming the episode list is stored in a file named 'episodes.tsv' in the imdb_files_directory
    episodes_file_path = os.path.join(imdb_files_directory, 'title.episode.tsv')
    with open(episodes_file_path, 'r') as file:
        next(file)  # Skip the header
        for line in file:
            parts = line.strip().split('\t')
            if len(parts) > 1 and parts[1] == parent_tconst:
                episodes.append(parts[0])
    return episodes

def process_tv_series_episodes(episodes, output_directory,tvseries_const):
    i=0
    for episode_tconst in episodes:
        print("%d)"%i,end="")
        i+=1
        subprocess.run(["python3", "episodes_alot.py", episode_tconst, f"{tvseries_const}"])

def main():
    if len(sys.argv) > 1:
        tconst = sys.argv[1]
    else:
        tconst = input("Enter the tconst: ")
    tvseries_const = tconst
    print(f"Processing TV series with tconst {tconst}")

    output_directory = create_directory_for_tconst(tconst)
    tv_series_details, backdrop_url = get_tv_series_details_from_tmdb(tconst, tmdb_api_key)

    if backdrop_url:
        search_in_imdb_files_with_photo(tconst, imdb_files_directory, backdrop_url, output_directory)
        # Add any specific processing you need for the TV series data here

    episodes = get_episodes_list(tconst, imdb_files_directory)
    process_tv_series_episodes(episodes, output_directory,tvseries_const)

    print(f"Processed IMDb files for TV series with tconst {tconst}")

if __name__ == "__main__":
    main()
