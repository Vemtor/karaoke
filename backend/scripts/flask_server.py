import json
import os

import audio_splitter
import text_generator
from flask import Flask, jsonify, request

app = Flask(__name__)
resources_path = "src/main/resources"


def getFile(youtube_url):
    song_id = audio_splitter.extract_video_id(youtube_url)
    file_name = f"{resources_path}/{song_id}/{song_id}.mp3"
    if os.path.exists(file_name):
        return file_name

    file_name = audio_splitter.download_audio_from_youtube_url(youtube_url, song_id)
    name_without_extension, _ = os.path.splitext(file_name)
    return audio_splitter.wavToMp3(name_without_extension)


@app.route("/transcribe", methods=["POST"])
def transcribe():
    """API endpoint for audio transcription"""
    yt_url = request.args.get("youtube_url")
    try:
        file = getFile(yt_url)
    except Exception:
        return jsonify({"error": "File couldn't be downloaded"}), 400

    try:
        transcription_file, _ = os.path.splitext(file)
        transcription_file += ".json"
        if os.path.exists(transcription_file):
            with open(transcription_file) as f:
                transcription = json.load(f)
            return transcription
        result = text_generator.whisper_service.transcribe(file)
        with open(transcription_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
        return jsonify(result)
    except Exception as e:
        text_generator.logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/split", methods=["POST"])
def split():
    """API endpoint for audio transcription"""
    try:
        yt_url = request.args.get("youtube_url")
        return audio_splitter.split(yt_url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ! when server is busy spring is taking a lat of resources,
# polish song translation might be bad,
# ! rethink using medium model but it's very resource
# demanding... and transcription can take a much longer ...

if __name__ == "__main__":
    # default optional, second arg
    port = int(os.environ.get("FLASK_SERVER_PORT", 8889))
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
