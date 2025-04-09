import argparse
import os
import subprocess
import sys
from audio_extract import extract_audio
from pytubefix import YouTube


def splitAudio(song_file, directory):
    vocal_remover_file = "scripts/vocal-remover/inference.py"
    try:
        subprocess.run(["python3", vocal_remover_file, "--input", song_file, "--output_dir", directory])
    except subprocess.CalledProcessError as e:
        print(f"Error during audio splitting: {e}", file=sys.stderr)
        sys.exit(2)


def download_audio_from_youtube_url(youtube_url, directory_name):
    try:
        songs_dir = f"songs/{directory_name}"
        os.makedirs(songs_dir, exist_ok=True)
        yt = YouTube(youtube_url)
        ys = yt.streams.filter(only_audio=True).first()
        file_path = ys.download(output_path="./" + songs_dir, filename=directory_name + ".mp4")

        file_name = os.path.relpath(file_path)
        output_wav = songs_dir + "/" + directory_name + ".wav"
        if not os.path.exists(output_wav):
            extract_audio(input_path=file_name, output_path=output_wav,
                          output_format="wav")
            os.remove(file_name)

        return songs_dir + "/" + directory_name + ".wav"
    except Exception as e:
        print(f"Error downloading audio: {str(e)}")
        sys.exit(3)


def extract_video_id(youtube_url):
    video_id = youtube_url.split('v=', 1)[1]
    return video_id


def wavToMp3(fileName):
    wavFile = fileName + ".wav"
    mp3File = fileName + ".mp3"

    if not os.path.exists(mp3File):
        extract_audio(input_path=wavFile, output_path=mp3File,
                      output_format="mp3")

    if os.path.exists(wavFile):
        os.remove(wavFile)


def main():
    parser = argparse.ArgumentParser(description="Download and process audio from YouTube.")
    parser.add_argument("youtube_url", type=str, help="The URL of the YouTube video to download.")

    args = parser.parse_args()

    directory_name = extract_video_id(args.youtube_url)
    songs_dir = f"songs/{directory_name}"

    file_name = download_audio_from_youtube_url(args.youtube_url, directory_name)

    if file_name:
        splitAudio(file_name, songs_dir)

        vocals = f"{songs_dir}/{directory_name}_Vocals"
        instruments = f"{songs_dir}/{directory_name}_Instruments"

        wavToMp3(vocals)
        wavToMp3(instruments)


if __name__ == "__main__":
    main()
