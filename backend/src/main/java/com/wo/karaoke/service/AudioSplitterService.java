package com.wo.karaoke.service;

import com.wo.karaoke.exception.AudioSplitException;
import com.wo.karaoke.exception.WrongUrlException;
import com.wo.karaoke.model.AudioSplitResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.io.*;


@Service
public class AudioSplitterService {

    private static final String AUDIO_SPLITTER_COMMAND = "%s ./scripts/audio-splitter.py %s";
    private static final String SONG_DIRECTORY = "./songs/";
    private static final String INSTRUMENTS_SUFFIX = "_Instruments.mp3";
    private static final String VOCALS_SUFFIX = "_Vocals.mp3";
    private static final String ENDPOINT_PATH = "/audio/split/";
    private static final Logger logger = LoggerFactory.getLogger(AudioSplitterService.class);

    @Value("${python.interpreter.command}")
    private String PYTHON_INTERPRETER;

    public AudioSplitResponse splitAudio(String youtubeUrl) throws IOException, InterruptedException {
        String songId = getSongId(youtubeUrl);
        logger.info(songId);

        String instrumentsFileName = songId + INSTRUMENTS_SUFFIX;
        String vocalsFileName = songId + VOCALS_SUFFIX;
        String directoryName = SONG_DIRECTORY + songId;

        File vocalsFile = new File(directoryName, vocalsFileName);
        File instrumentsFile = new File(directoryName, instrumentsFileName);

        if (!vocalsFile.exists() || !instrumentsFile.exists()) {
            callAudioSplitterScript(youtubeUrl);
        }
        return new AudioSplitResponse(ENDPOINT_PATH + songId + "/" + vocalsFileName,
                ENDPOINT_PATH + songId + "/" + instrumentsFileName);
    }

    public FileSystemResource getAudio(String directoryName, String fileName) throws IOException {
        File file = new File(SONG_DIRECTORY + directoryName, fileName);

        if (!file.exists()) {
            throw new FileNotFoundException(String.format("%s not found", fileName));
        }
        return new FileSystemResource(file);
    }

    private String getSongId(String youtubeUrl) {
        if (youtubeUrl != null && youtubeUrl.contains("youtube.com/watch?v=")) {
            return youtubeUrl.substring(youtubeUrl.indexOf("v=") + 2);
        }
        throw new WrongUrlException();
    }

    private void callAudioSplitterScript(String youtubeUrl) throws IOException, InterruptedException {
        String command = String.format(AUDIO_SPLITTER_COMMAND, PYTHON_INTERPRETER, youtubeUrl);
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[PYTHON] " + line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            switch (exitCode) {
                case 2:
                    throw new AudioSplitException("Error during audio splitting.");
                case 3:
                    throw new AudioSplitException("Error downloading or processing audio.");
                default:
                    throw new RuntimeException("An unknown error occured");
            }
        }
    }
}
