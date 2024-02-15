import requests
import os
import sys
import shutil

# Function to get person details from TMDB using nconst
def get_person_details_from_tmdb(nconst, api_key, width_variable):
    tmdb_search_url = f"https://api.themoviedb.org/3/find/{nconst}?api_key={api_key}&external_source=imdb_id"
    response = requests.get(tmdb_search_url)
    if response.status_code == 200:
        data = response.json()
        if data['person_results']:
            person_details = data['person_results'][0]
            profile_path = person_details.get('profile_path')
            if profile_path:
                profile_url = f"https://image.tmdb.org/t/p/{width_variable}{profile_path}"
                return profile_url
    return None

def process_name_basics_file(folder_path, api_key, width_variable):
    file_path = os.path.join(folder_path, "name.basics_add.tsv")
    temp_file_path = os.path.join(folder_path, "temp_name.basics_add.tsv")

    with open(file_path, 'r', encoding='utf-8') as infile, open(temp_file_path, 'w', encoding='utf-8') as temp_outfile:
        next(infile)  # Skip the header line
        temp_outfile.write("nconst\tprimaryName\tbirthYear\tdeathYear\tprimaryProfession\tknownForTitles\timg_url_asset\n")  # Writing headers to temp file

        for line in infile:
            columns = line.strip().split('\t')
            nconst = columns[0]
            profile_url = get_person_details_from_tmdb(nconst, api_key, width_variable)
            if profile_url:
                line = line.strip() + '\t' + profile_url + '\n'
            else:
                line = line.strip() + '\t' + '\n'  # Or handle as needed
            temp_outfile.write(line)
    
    # Replace the original file with the temporary file
    shutil.move(temp_file_path, file_path)


def append_missing_nconsts_to_name_basics(folder_path, nconsts, api_key, width_variable):
    name_basics_path = os.path.join(folder_path, "name.basics_add.tsv")
    all_name_basics_path = os.path.join("all imdb", "name.basics.tsv")

    # Read existing nconsts in name.basics_add.tsv
    existing_nconsts = set()
    with open(name_basics_path, 'r', encoding='utf-8') as file:
        next(file)  # Skip header
        for line in file:
            nconst = line.split('\t')[0]
            existing_nconsts.add(nconst)

    # Append missing nconsts from all_name_basics.tsv
    with open(all_name_basics_path, 'r', encoding='utf-8') as all_file, \
            open(name_basics_path, 'a', encoding='utf-8') as name_file:
        next(all_file)  # Skip header
        for line in all_file:
            nconst = line.split('\t')[0]
            if nconst in nconsts and nconst not in existing_nconsts:
                name_file.write(line)

def collect_nconsts(file_path, split_directors_writers=False):
    nconsts = set()
    with open(file_path, 'r', encoding='utf-8') as file:
        next(file)  # Skip header
        for line in file:
            columns = line.strip().split('\t')
            for col in columns:
                if split_directors_writers:
                    # Splitting by ',' for directors and writers
                    nconsts.update(col.split(','))
                else:
                    nconsts.add(col)
    return nconsts


def main():
    if len(sys.argv) != 2:
        print("Usage: script.py <folder_name>")
        sys.exit(1)


    folder_name = sys.argv[1]
    api_key = "548e9052202183ea3888718b1e4dc4cc"  # Replace with your TMDB API key
    width_variable = "{width_variable}"  # Adjust as needed


    # Step 1: Collect nconsts
    principals_nconsts = collect_nconsts(os.path.join(folder_name, "title.principals_add.tsv"))
    crew_nconsts = collect_nconsts(os.path.join(folder_name, "title.crew_add.tsv"), split_directors_writers=True)
    combined_nconsts = principals_nconsts.union(crew_nconsts)

    # Step 2: Append missing nconsts to name.basics_add.tsv
    append_missing_nconsts_to_name_basics(folder_name, combined_nconsts, api_key, width_variable)



    process_name_basics_file(folder_name, api_key, width_variable)
    print("Processing complete.")

if __name__ == "__main__":
    main()
