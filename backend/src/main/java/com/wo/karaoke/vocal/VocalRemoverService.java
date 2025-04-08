package com.wo.karaoke.vocal;

import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class VocalRemoverService {
    private static final String SCRIPT_PATH = "/scripts/audio-splitter";
    private static final String VENV_PYTHON_PATH = "/.venv/bin/python3";

    @Async
    public FileSystemResource splitAudio(String youtubeUrl) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(VENV_PYTHON_PATH, SCRIPT_PATH, youtubeUrl);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        process.waitFor();
        String outputFileName = "";

        if (youtubeUrl != null && youtubeUrl.contains("youtube.com/watch?v=")) {
            String[] parts = youtubeUrl.split("v=");
            if (parts.length > 1) {
                outputFileName = parts[1];
            }
        }

        File outputFile = new File(String.format("/songs/%s", outputFileName), outputFileName + "_Instruments.wav");
        return new FileSystemResource(outputFile);
    }
}
