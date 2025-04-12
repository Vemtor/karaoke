# python

set up .venv with python 3.10 in backend dir then install dependencies
```
pip install flask torch
pip install -U openai-whisper
```

# sending files to api

without saving json file
```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/main/resources/songs/one_time.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe
```


with saving to json managed by spring
```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/main/resources/songs/7dam.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true


curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@src/main/resources/songs/firework.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true

```