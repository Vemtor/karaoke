# python

set up .venv with python 3.10 in backend dir, activate it then install dependencies

```bash
source .venv/bin/activate
```

# Setup
It's necessary to install python dependencies before running the app. Please do it in virtual env ".venv", you need to use python 3.10 as the newer versions don't work with the vocal-remover library.
```
pip install flask torch
pip install -U openai-whisper
karaoke/backend$ python3.10 -m venv .venv
karaoke/backend$  source .venv/bin/activate
(.venv)  karaoke/backend$ pip install -r requirements.txt
```

# songs

create folder songs for testing purpose in test/resources/songs with song files with .mp3 extension, then you
can run below commands after starting spring app or just run integration test

# sending files to api

with saving to json managed by spring

If you don't want to use venv or want to call it a different name, change the python.interpreter.command property in application.properties:
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

python.interpreter.command=source ./.venv/bin/activate && python3.10
```

You should also download the vocal remover and place it in scripts directory (https://github.com/tsurumeso/vocal-remover/releases/download/v5.1.1/vocal-remover-v5.1.1.zip):
![images/vocal-remover-position.png](images/vocal-remover-position.png)
