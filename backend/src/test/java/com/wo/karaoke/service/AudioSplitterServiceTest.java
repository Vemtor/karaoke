package com.wo.karaoke.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AudioSplitterServiceTest {

    private FlaskRequestExecutor flaskRequestExecutor;
    private AudioSplitterService audioSplitterService;

    private final String FLASK_SPLIT_URL = "http://localhost:5000/split";
    private final String SONG_DIRECTORY = "src/test/resources/songs/";

    @BeforeEach
    void setUp() {
        flaskRequestExecutor = mock(FlaskRequestExecutor.class);
        audioSplitterService = new AudioSplitterService(flaskRequestExecutor);

        ReflectionTestUtils.setField(audioSplitterService, "flaskSplitUrl", FLASK_SPLIT_URL);
        ReflectionTestUtils.setField(audioSplitterService, "songDirectory", SONG_DIRECTORY);
    }

    @Test
    void testSplitAudio_returnsExpectedMap() throws Exception {
        String youtubeUrl = "https://youtube.com/watch?v=test";
        Map<String, Object> mockResponse = Map.of("vocalsPath", "/vocals.wav", "instrumentsPath", "/instruments.wav");

        when(flaskRequestExecutor.processAudio(youtubeUrl, FLASK_SPLIT_URL)).thenReturn(mockResponse);

        Map<String, Object> result = audioSplitterService.splitAudio(youtubeUrl);

        assertEquals("/vocals.wav", result.get("vocalsPath"));
        assertEquals("/instruments.wav", result.get("instrumentsPath"));
        verify(flaskRequestExecutor).processAudio(youtubeUrl, FLASK_SPLIT_URL);
    }

    @Test
    void testGetAudio_returnsFileSystemResource_whenFileExists() throws IOException {
        String testDir = "test-folder/";
        String testFile = "test.wav";

        File dir = new File(SONG_DIRECTORY + testDir);
        dir.mkdirs();
        File file = new File(dir, testFile);
        file.createNewFile();

        FileSystemResource resource = audioSplitterService.getAudio(testDir, testFile);

        assertNotNull(resource);
        assertTrue(resource.exists());
        assertEquals(file.getAbsolutePath(), resource.getFile().getAbsolutePath());

        file.delete();
        dir.delete();
    }

    @Test
    void testGetAudio_throwsFileNotFound_whenFileDoesNotExist() {
        String testDir = "missing-folder/";
        String testFile = "nonexistent.wav";

        FileNotFoundException exception = assertThrows(FileNotFoundException.class, () ->
                audioSplitterService.getAudio(testDir, testFile)
        );

        assertEquals("nonexistent.wav not found", exception.getMessage());
    }
}
