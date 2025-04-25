import os
import subprocess
from audio_extract import extract_audio
from pytubefix import YouTube

resources_path = "src/main/resources"


def splitAudio(song_file, directory):
    vocal_remover_file = "scripts/vocal-remover/inference.py"
    try:
        subprocess.run(["python3", vocal_remover_file, "--input", song_file, "--output_dir", directory])
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error during audio splitting: {e}")


def download_audio_from_youtube_url(youtube_url, song_id):
    try:
        directory_name = f"{resources_path}/songs/{song_id}"
        os.makedirs(directory_name, exist_ok=True)
        yt = YouTube(youtube_url)
        ys = yt.streams.filter(only_audio=True).first()

        output_wav = directory_name + "/" + song_id + ".wav"
        if not os.path.exists(output_wav):
            file_path = ys.download(output_path=f"./{directory_name}",
                                    filename=f"{song_id}.mp4")
            file_name = os.path.relpath(file_path)
            extract_audio(input_path=file_name, output_path=output_wav,
                          output_format="wav")
            os.remove(file_name)

        return directory_name + "/" + song_id + ".wav"
    except Exception as e:
        raise Exception(f"Error downloading audio: {str(e)}")


def extract_video_id(youtube_url):
    video_id = youtube_url.split('v=', 1)[1]
    return video_id


def wavToMp3(fileName, removeWav=True):
    wavFile = f"./{fileName}.wav"
    mp3File = f"./{fileName}.mp3"

    if not os.path.exists(mp3File):
        extract_audio(input_path=wavFile, output_path=mp3File,
                      output_format="mp3")

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
        "instrumentsPath": f"/api/audio/split/{song_id}/{song_id}_Instruments.mp3"
    }
