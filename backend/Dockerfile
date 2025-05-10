FROM openjdk:21-jdk
WORKDIR /app
RUN mkdir -p src/main/resources/songs
COPY target/karaokeBackend-0.0.1-SNAPSHOT.jar karaokeBackend-0.0.1-SNAPSHOT.jar

ENV FLASK_TRANSCRIPTION_URL=http://flask-service:8889/transcribe
ENV FLASK_SPLITTER_URL=http://flask-service:8889/split
ENV RESOURCES_DIR=/app/src/main/resources/songs/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "karaokeBackend-0.0.1-SNAPSHOT.jar"]