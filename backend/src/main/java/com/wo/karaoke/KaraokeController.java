package com.wo.karaoke;

import com.wo.karaoke.exception.AudioSplitException;
import com.wo.karaoke.model.AudioSplitResponse;
import com.wo.karaoke.service.AudioSplitterService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
public class KaraokeController {
    private final AudioSplitterService audioSplitterService;

    public KaraokeController(AudioSplitterService audioSplitterService) {
        this.audioSplitterService = audioSplitterService;
    }

    @PostMapping(value = "/audio/split", produces = "application/json")
    public ResponseEntity<AudioSplitResponse> splitAudio(@RequestParam String youtubePath) {
        try {
            AudioSplitResponse response = audioSplitterService.splitAudio(youtubePath);
            return ResponseEntity.ok().body(response);
        } catch (IOException | InterruptedException e) {
            throw new AudioSplitException("An error occured while running audio splitting script.");
        }
    }

    @GetMapping(value = "/audio/split/{directoryName}/{fileName}", produces = "audio/mpeg")
    public ResponseEntity<FileSystemResource> getAudio(@PathVariable String directoryName,
                                                       @PathVariable String fileName) throws IOException {
        return ResponseEntity.ok().body(audioSplitterService.getAudio(directoryName, fileName));
    }
}
