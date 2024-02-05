# Importing necessary libraries
import requests
import os
import sys


width_variable="{width_variable}"
# Updated function to get movie details (including backdrop photo) from TMDB using tconst
def get_movie_details_from_tmdb(tconst, api_key):
    tmdb_search_url = f"https://api.themoviedb.org/3/find/{tconst}?api_key={api_key}&external_source=imdb_id"

    response = requests.get(tmdb_search_url)
    if response.status_code == 200:
        data = response.json()
        if data['movie_results']:
            movie_details = data['movie_results'][0]
            backdrop_path = movie_details.get('poster_path')
            if backdrop_path:
                backdrop_url = f"https://image.tmdb.org/t/p/{width_variable}{backdrop_path}"

                return movie_details, backdrop_url
    return None, None


# Function to create a new directory for the tconst
def create_directory_for_tconst(tconst):
    directory_name = os.path.join('../sql/update', tconst)

    if not os.path.exists(directory_name):
        os.makedirs(directory_name)

    else:
        print("",end="")
    return directory_name


def search_in_imdb_files_with_photo(tconst, imdb_files_directory, backdrop_url, output_directory,movie_name):
    for file in os.listdir(imdb_files_directory):
        if file.endswith(".tsv"):
            input_file_path = os.path.join(imdb_files_directory, file)
            output_file_name = file.split('.')[0]+"."+file.split('.')[1] + '_add.tsv'
            output_file_path = os.path.join(output_directory, output_file_name)
            with open(input_file_path, 'r', encoding='utf-8') as infile, open(output_file_path, 'w', encoding='utf-8') as outfile:
                headers = infile.readline()  # Read the header line


                if 'title.principals.tsv' in input_file_path:
                    headers = headers.strip() + '\timg_url_asset\n'
                if 'title.basics.tsv' in input_file_path:
                    headers = headers.strip() + '\timg_url_asset\n'

                outfile.write(headers)  # Write the header line to the output file
                flag = True
                for line in infile:
                    columns = line.split('\t')
                    if any(tconst == column.strip() for column in columns):
                        if 'title.basics.tsv' in input_file_path:
                            line = line.strip() + '\t' + backdrop_url + '\n'
                        if 'title.principals.tsv' in input_file_path:
                            line = line.strip() + '\t' + '\n'
                        if file.endswith("title.basics.tsv") and flag:

                            movie_name = columns[2]
                            flag = False
                        outfile.write(line)


def collect_nconsts_from_new_folder(folder_path):
    nconsts = set()  # Using a set to avoid duplicates
    for file in os.listdir(folder_path):
        if file.endswith("_add.tsv") and file != "name.basics_add.tsv":
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r', encoding='utf-8') as infile:
                for line in infile:
                    columns = line.split('\t')
                    for column in columns:
                        if column.startswith("nm"):
                            nconsts.add(column.strip())
    return list(nconsts)

def populate_name_basics_add(tconst, name_basics_file_path, nconsts, output_directory):
    output_file_path = os.path.join(output_directory, 'name.basics_add.tsv')
    with open(name_basics_file_path, 'r', encoding='utf-8') as infile, open(output_file_path, 'w', encoding='utf-8') as outfile:
        headers = infile.readline()  # Read the header line
        outfile.write(headers)  # Write the header line to the output file
        for line in infile:
            if any(nconst in line for nconst in nconsts):
                outfile.write(line)

def get_person_details_from_tmdb(nconst, api_key):
    tmdb_search_url = f"https://api.themoviedb.org/3/find/{nconst}?api_key={api_key}&external_source=imdb_id"
    response = requests.get(tmdb_search_url)
    if response.status_code == 200:
        data = response.json()
        if data['person_results']:
            person_details = data['person_results'][0]
            profile_path = person_details.get('profile_path')
            if profile_path:
                profile_url = f"https://image.tmdb.org/t/p/{width_variable}{profile_path}"
                return person_details, profile_url
    return None, None

# Updated function to add person info even if the photo is not found

def search_nconsts_and_get_photos_updated(name_basics_file_path, nconsts_list, api_key, output_directory):
    output_file_path = os.path.join(output_directory, 'name.basics_add.tsv')
    line_count = 0  # Debugging: Count the number of lines processed

    with open(name_basics_file_path, 'r', encoding='utf-8') as infile, open(output_file_path, 'w', encoding='utf-8') as outfile:

        headers = infile.readline().strip()  # Remove any trailing newline characters

        # Add 'img_url_asset' as a new column to the headers, ensuring separation by tabs
        headers = headers + '\timg_url_asset\n'
        outfile.write(headers)
        
        for line in infile:
            line_count += 1  # Increment line count
            columns = line.split('\t')
            nconst = columns[0].strip()

            if nconst in nconsts_list:
                _, photo_url = get_person_details_from_tmdb(nconst, api_key)
                line = line.strip()
                if photo_url:
                    line += '\t' + photo_url
                line += '\n'
                outfile.write(line)

 
# Sample usage
tmdb_api_key = "548e9052202183ea3888718b1e4dc4cc"  # Replace with your TMDB API key
imdb_files_directory = "../../all imdb"  # Local directory path




def main():
    # Check if a tconst is provided as a command-line argument

    
    if len(sys.argv) > 1:
        tconst = sys.argv[1]
    else:
        # If not provided, prompt the user to enter it
        tconst = input("Enter the tconst: ")
    tconst_input = tconst
    # Rest of your script where you use the tconst

    
    output_directory = create_directory_for_tconst(tconst)

    # Get movie details and backdrop URL from TMDB
    mtails, backdrop_url = get_movie_details_from_tmdb(tconst, tmdb_api_key)


    movie_name=None
    if backdrop_url:
        search_in_imdb_files_with_photo(tconst, imdb_files_directory, backdrop_url, output_directory,movie_name)




    output_directory = os.path.join("../sql/update", tconst)  # Directory where the new files are stored
    nconsts_list = collect_nconsts_from_new_folder(output_directory)
    name_basics_file_path = os.path.join(imdb_files_directory, "name.basics.tsv")
    populate_name_basics_add(tconst, name_basics_file_path, nconsts_list, output_directory)


    # Assuming nconsts_list is already populated as in the previous step
    search_nconsts_and_get_photos_updated(name_basics_file_path, nconsts_list, tmdb_api_key, output_directory)

 
    '''
    if movie_name:
        new_directory_name = os.path.join('.', movie_name)
        os.rename(output_directory, new_directory_name)
        print(f"Folder renamed to {movie_name}")
    ''' 



if __name__ == "__main__":
    main()

    