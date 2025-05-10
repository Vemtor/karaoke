FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    unzip \
    wget \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

RUN mkdir -p scripts && \
    wget https://github.com/tsurumeso/vocal-remover/releases/download/v5.1.1/vocal-remover-v5.1.1.zip -O vocal-remover.zip && \
    unzip vocal-remover.zip -d scripts/ && \
    rm vocal-remover.zip


COPY requirements.txt .
RUN pip install -r requirements.txt

RUN mkdir -p /root/.cache/whisper && \
    python -c "import whisper; whisper.load_model('small')"

RUN mkdir -p src/main/resources/songs

COPY audio_splitter.py ./scripts
COPY text_generator.py ./scripts
COPY flask_server.py ./scripts


ENV FLASK_SERVER_PORT=8889
ENV PYTHONUNBUFFERED=1

VOLUME [ "/app/backend/src/main/resources/songs" ]

EXPOSE 8889

CMD ["python", "/app/backend/scripts/flask_server.py"]

