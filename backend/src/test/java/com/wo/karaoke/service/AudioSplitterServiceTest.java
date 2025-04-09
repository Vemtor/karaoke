package com.wo.karaoke.service;

import com.wo.karaoke.model.AudioSplitResponse;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class AudioSplitterServiceTest {

    private final AudioSplitterService audioService = new AudioSplitterService();

    @Test
    public void splitAudio() throws IOException, InterruptedException {
        String youtubeUrl = "localhost:8080/audio/split?youtubePath=https://www.youtube.com/watch?v=uHZO0TOc5Tk";

        AudioSplitResponse response = audioService.splitAudio(youtubeUrl);

        assertNotNull(response);
        assertEquals("/audio/split/uHZO0TOc5Tk/uHZO0TOc5Tk_Vocals.mp3", response.vocalsPath());
        assertEquals("/audio/split/uHZO0TOc5Tk/uHZO0TOc5Tk_Instruments.mp3", response.instrumentsPath());
    }

    @Test
    public void getAudio() throws IOException {
        String directoryName = "../songs/uHZO0TOc5Tk";
        String fileName = "uHZO0TOc5Tk_Instruments.mp3";

        FileSystemResource result = audioService.getAudio(directoryName, fileName);

        assertNotNull(result);
    }

}
