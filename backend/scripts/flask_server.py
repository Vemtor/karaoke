import json
import os
from flask import Flask, request, jsonify

import audio_splitter
from text_generator import *

app = Flask(__name__)


def getFile(youtube_url):
    directory_name = audio_splitter.extract_video_id(youtube_url)
    file_name = f"songs/{directory_name}/{directory_name}.mp3"

    if os.path.exists(file_name):
        return file_name

    file_name = audio_splitter.download_audio_from_youtube_url(youtube_url, directory_name)

    name_without_extension, _ = os.path.splitext(file_name)
    return audio_splitter.wavToMp3(name_without_extension)


@app.route('/transcribe', methods=['POST'])
def transcribe():
    """API endpoint for audio transcription"""
    yt_url = request.args.get("youtube_url")
    try:
        file = getFile(yt_url)
    except:
        return jsonify({'error': 'File couldn\'t be downloaded'}), 400

    try:
        transcription_file, _ = os.path.splitext(file)
        transcription_file += ".json"
        if os.path.exists(transcription_file):
            with open(transcription_file, "r") as f:
                transcription = json.load(f)
            return transcription
        result = whisper_service.transcribe(file)

        with open(transcription_file, "w") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@app.route('/split', methods=['POST'])
def split():
    """API endpoint for audio transcription"""
    yt_url = request.args.get("youtube_url")
    try:
        return audio_splitter.split(yt_url)
    except:
        return jsonify({'error': str(e)}), 500


def clean_up(temp_dir, temp_file):
    if os.path.exists(temp_file):
        os.remove(temp_file)
    if os.path.exists(temp_dir):
        os.rmdir(temp_dir)


# ! when server is busy spring is taking a lat of resources, polish song translation might be bad,
# ! rethink using medium model but it's very resource demanding... and transcription can take a much longer ...

if __name__ == '__main__':
    # default optional, second arg
    port = int(os.environ.get("FLASK_SERVER_PORT", 8889))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
