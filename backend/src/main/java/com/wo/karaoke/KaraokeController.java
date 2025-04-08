package com.wo.karaoke;

import com.wo.karaoke.vocal.VocalRemoverService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;


@RestController
public class KaraokeController {
    private final VocalRemoverService vocalRemoverService;

    public KaraokeController(VocalRemoverService vocalRemoverService) {
        this.vocalRemoverService = vocalRemoverService;
    }

    @PostMapping(value = "/audio/split", produces = "audio/mpeg")
    public ResponseEntity<FileSystemResource> splitAudio(@RequestParam String youtubePath) {
        FileSystemResource fileSystemResource = null;
        try {
            fileSystemResource = vocalRemoverService.splitAudio(youtubePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body(fileSystemResource);
    }
}
