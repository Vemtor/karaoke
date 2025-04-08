import argparse
import os
import subprocess
from audio_extract import extract_audio
from pytubefix import YouTube


def splitAudio(song_file, directory):
    vocal_remover_file = "scripts/vocal-remover/inference.py"
    print(directory)
    subprocess.run(["python3", vocal_remover_file, "--input", song_file, "--output_dir", directory])


def download_audio_from_youtube_url(youtube_url, directory_name):
    try:
        songs_dir = f"songs/{directory_name}"
        os.makedirs(songs_dir, exist_ok=True)
        yt = YouTube(youtube_url)
        ys = yt.streams.get_highest_resolution()
        file_path = ys.download(output_path="./" + songs_dir, filename=directory_name + ".mp4")

        file_name = os.path.relpath(file_path)
        try:
            extract_audio(input_path=file_name, output_path=songs_dir + "/" + directory_name + ".wav",
                          output_format="wav")
        except Exception as e:
            print("a")

        return songs_dir + "/" + directory_name + ".wav"
    except Exception as e:
        print(f"Error downloading audio: {str(e)}")
        return None


def extract_video_id(youtube_url):
    video_id = youtube_url.split('v=')[-1]  # After 'v=' part
    video_id = video_id.split('&')[0]  # Take the part before any '&' symbol
    return video_id


def main():
    parser = argparse.ArgumentParser(description="Download and process audio from YouTube.")
    # parser.add_argument("directory_name", type=str, help="The name of the directory to save audio and output.")
    parser.add_argument("youtube_url", type=str, help="The URL of the YouTube video to download.")

    args = parser.parse_args()

    directory_name = extract_video_id(args.youtube_url)
    songs_dir = f"songs/{directory_name}"

    file_name = download_audio_from_youtube_url(args.youtube_url, directory_name)
    if file_name:
        splitAudio(file_name, songs_dir)


if __name__ == "__main__":
    main()
