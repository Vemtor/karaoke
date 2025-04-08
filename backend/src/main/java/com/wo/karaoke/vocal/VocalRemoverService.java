package com.wo.karaoke.vocal;

import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class VocalRemoverService {
    private static final String SCRIPT_PATH = "./scripts/audio-splitter.py";

    public FileSystemResource splitAudio(String youtubeUrl) throws IOException, InterruptedException {
        String command = String.format("source ./.venv/bin/activate && python3.10 %s %s", SCRIPT_PATH, youtubeUrl);
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[PYTHON] " + line);  // or use a logger
            }
        }
        process.waitFor();
        String outputFileName = "";

        if (youtubeUrl != null && youtubeUrl.contains("youtube.com/watch?v=")) {
            String[] parts = youtubeUrl.split("v=");
            if (parts.length > 1) {
                outputFileName = parts[1];
            }
        }

        File outputFile = new File(String.format("./songs/%s", outputFileName), outputFileName + "_Instruments.wav");
        return new FileSystemResource(outputFile);
    }
}
