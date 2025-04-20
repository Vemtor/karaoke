from flask import Flask, request, jsonify
import torch
import whisper
import os
import tempfile
import logging
from typing import Dict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)


class WhisperService:
    def __init__(self):
        self.models = {}
        self._load_models()

    def _load_models(self):
        try:
            self.models = {
                "tiny": whisper.load_model("tiny"),
                "small": whisper.load_model("small"),
            }
            logger.info("All models loaded successfully!")
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise

    def choose_model(self, language: str) -> str:
        # if language == "en":
        #     return "tiny"
        return "small"

    def detect_language(self, audio_tensor: torch.Tensor) -> str:
        mel = whisper.log_mel_spectrogram(audio_tensor).to(self.models["small"].device)
        _, probs = self.models["small"].detect_language(mel)
        detected_lang = max(probs, key=probs.get)
        logger.info(f"Detected language: {detected_lang}")
        return detected_lang

    def transcribe(self, file_path: str) -> Dict:
        audio = whisper.load_audio(file_path)
        audio_tensor = torch.from_numpy(whisper.pad_or_trim(audio)).float()

        language = self.detect_language(audio_tensor)
        model_key = self.choose_model(language)
        selected_model = self.models[model_key]
        logger.info(f"Using {model_key} model for transcription")

        options = {
            "task": "transcribe",
            "language": language,
            "fp16": torch.cuda.is_available()
        }

        result = selected_model.transcribe(file_path, **options)

        response = {
            'full_text': result['text'],
            'segments': []
        }

        for segment in result['segments']:
            response['segments'].append({
                'end': segment['end'],
                'start': segment['start'],
                'text': segment['text']
            })

        return response


whisper_service = WhisperService()


@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for audio transcription"""

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No selected file'}), 400

    temp_dir = tempfile.mkdtemp()
    temp_file = os.path.join(temp_dir, 'audio.mp3')

    try:
        file.save(temp_file)
        result = whisper_service.transcribe(temp_file)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
    finally:
        clean_up(temp_dir, temp_file)


def clean_up(temp_dir, temp_file):
    if os.path.exists(temp_file):
        os.remove(temp_file)
    if os.path.exists(temp_dir):
        os.rmdir(temp_dir)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8888))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
