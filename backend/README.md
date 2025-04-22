# python

set up .venv with python 3.10 in backend dir, activate it then install dependencies

```bash
source .venv/bin/activate
```

```
pip install flask torch
pip install -U openai-whisper
```

# songs

create folder songs for testing purpose in test/resources/songs with song files with .mp3 extension, then you
can run below commands after starting spring app or just run integration test

# sending files to api

with saving to json managed by spring

```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/song1.mp3;type=audio/mpeg" \
   http://localhost:8080/api/audio/transcribe
```

```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/7dam.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe


curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/firework.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe

```

