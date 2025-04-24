import logging
import torch
import whisper
from typing import Dict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


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

    # transcription is worse while using tiny model, but results are retrieved faster
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
                'end': round(segment['end'], 2),
                'start': round(segment['start'], 2),
                'text': segment['text']
            })

        return response


whisper_service = WhisperService()
