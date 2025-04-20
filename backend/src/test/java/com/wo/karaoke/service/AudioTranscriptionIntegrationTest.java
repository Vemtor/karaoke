package com.wo.karaoke.service;


import com.wo.karaoke.FlaskStarter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "transcription.folder=src/test/resources/transcriptions"
        }

)
@ActiveProfiles("integration-test")
public class AudioTranscriptionIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FlaskStarter flaskStarter;

    @Value("${local.server.port}")
    private int port;
    private String URL;

    @BeforeEach
    void setUp() throws InterruptedException {
        URL = "http://localhost:" + port + "/api/audio/transcribe?saveJson=true";

        for (int i = 0; i < 30; i++) {
            if (flaskStarter.isServerRunning()) {
                System.out.println("Flask server is running, continuing with test");
                break;
            }
            System.out.println("Waiting for Flask server to start...");
            Thread.sleep(1000);
        }

        assertTrue(flaskStarter.isServerRunning(), "Flask server failed to start");
    }

    @AfterEach
    void tearDown() {
        flaskStarter.stopServer();
    }


    @Test
    void processAudioWithRealFiles() throws IOException {
        File songsDir = new ClassPathResource("songs").getFile();
        File[] songFiles = songsDir.listFiles((dir, name) ->
                name.toLowerCase().endsWith(".mp3")
        );

        assertNotNull(songFiles);
        for (File songFile : songFiles) {
            FileSystemResource fileResource = new FileSystemResource(songFile);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            //call the API
            ResponseEntity<Map> response = restTemplate.exchange(URL, HttpMethod.POST, requestEntity, Map.class);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertNotNull(response.getBody().get("full_text"));
            assertNotNull(response.getBody().get("segments"));

            System.out.println("Transcription for " + songFile.getName() + ": " + response.getBody().get("text"));

        }
    }


}
