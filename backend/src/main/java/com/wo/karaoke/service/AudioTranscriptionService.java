package com.wo.karaoke.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
public class AudioTranscriptionService {

    private final FlaskRequestExecutor flaskRequestExecutor;
    @Value("${flask.server.transcription.url}")
    private String flaskServerTranscriptionUrl;

    public AudioTranscriptionService(FlaskRequestExecutor flaskRequestExecutor) {
        this.flaskRequestExecutor = flaskRequestExecutor;
    }

    public Map<String, Object> transcribe(String youtubeUrl) throws IOException, InterruptedException {
        return flaskRequestExecutor.processAudio(youtubeUrl, flaskServerTranscriptionUrl);
    }
}
