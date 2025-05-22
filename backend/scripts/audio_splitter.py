import os
import subprocess

import yt_dlp
from audio_extract import extract_audio

resources_path = "src/main/resources"


def splitAudio(song_file, directory):
    vocal_remover_file = "scripts/vocal-remover/inference.py"
    try:
        subprocess.run(
            [
                "python3",
                vocal_remover_file,
                "--input",
                song_file,
                "--output_dir",
                directory,
            ]
        )
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error during audio splitting: {e}") from e


def download_audio_from_youtube_url(youtube_url, song_id):
    try:
        directory_name = f"{resources_path}/songs/{song_id}"
        os.makedirs(directory_name, exist_ok=True)

        output_mp4 = os.path.join(directory_name, f"{song_id}.mp4")
        output_wav = directory_name + "/" + song_id + ".wav"
        if not os.path.exists(output_wav):
            ydl_opts = {
                "format": "bestaudio/best",
                "outtmpl": output_mp4,
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])
            extract_audio(
                input_path=output_mp4, output_path=output_wav, output_format="wav"
            )
            os.remove(output_mp4)

        return output_wav
    except Exception as e:
        raise Exception(f"Error downloading audio: {str(e)}") from e


def extract_video_id(youtube_url):
    video_id = youtube_url.split("v=", 1)[1]
    return video_id


def wavToMp3(fileName, removeWav=True):
    wavFile = f"./{fileName}.wav"
    mp3File = f"./{fileName}.mp3"

    if not os.path.exists(mp3File):
        extract_audio(input_path=wavFile, output_path=mp3File, output_format="mp3")

    if removeWav and os.path.exists(wavFile):
        os.remove(wavFile)

    if os.path.exists(mp3File):
        return mp3File
    else:
        raise Exception("Error converting wav to mp3")


def split(youtube_url):
    song_id = extract_video_id(youtube_url)
    directory_name = f"{resources_path}/songs/{song_id}"

    file_name = download_audio_from_youtube_url(youtube_url, song_id)

    if file_name:
        vocals = f"{directory_name}/{song_id}_Vocals"
        instruments = f"{directory_name}/{song_id}_Instruments"

        if not os.path.exists(vocals + ".mp3") or not os.path.exists(vocals + ".mp3"):
            splitAudio(file_name, directory_name)

            wavToMp3(vocals)
            wavToMp3(instruments)
    return {
        "vocalsPath": f"/api/audio/split/{song_id}/{song_id}_Vocals.mp3",
        "instrumentsPath": f"/api/audio/split/{song_id}/{song_id}_Instruments.mp3",
    }
