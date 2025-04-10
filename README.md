# python

```
pip install flask torch
pip install -U openai-whisper
```

# sending files to api

without saving json file
```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/home/ariel/Music/one_time.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe
```


with saving to json managed by spring
```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/home/ariel/Music/7dam.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true


curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/home/ariel/Music/firework.mp3;type=audio/mpeg" \
  http://localhost:8080/api/audio/transcribe\?saveJson\=true

```