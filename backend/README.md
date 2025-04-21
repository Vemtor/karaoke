# python

set up .venv with python 3.10 in backend dir, activate it then install dependencies

```bash
source .venv/bin/activate
```

```
pip install flask torch
pip install -U openai-whisper
```

# sending files to api

with saving to json managed by spring

```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/one_time.mp3;type=audio/mpeg" \
   http://localhost:8080/api/audio/transcribe\?saveJson\=true
```

```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/7dam.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true


curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/test/resources/songs/firework.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true

```

without saving json file just remove \?saveJason\=true