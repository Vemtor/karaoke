package com.wo.karaoke.service;

import com.wo.karaoke.helpers.CachedMultipartFile;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
public class FlaskRequestQueueService {
    //it takes around 2 to 4 minutes, but I set up buffer for 7
    private static final int PROCESSING_TIMEOUT = 7;

    private final AudioTranscriptionService audioTranscriptionService;
    private final BlockingQueue<TranscriptionTask> taskQueue;
    private final ExecutorService executorService;
    private final AtomicBoolean isProcessing;

    @Autowired
    public FlaskRequestQueueService(AudioTranscriptionService audioTranscriptionService) {
        this.audioTranscriptionService = audioTranscriptionService;
        this.taskQueue = new LinkedBlockingQueue<>();
        this.executorService = Executors.newSingleThreadExecutor();
        this.isProcessing = new AtomicBoolean(false);

        startQueueProcessor();
    }


    public Map<String, Object> processAudioQueued(MultipartFile file) throws Exception {
        CompletableFuture<Void> processingStarted = new CompletableFuture<>();
        CompletableFuture<Map<String, Object>> resultFuture = new CompletableFuture<>();

        MultipartFile fileCopy = copyMultipartFile(file);
        taskQueue.add(new TranscriptionTask(fileCopy, resultFuture, processingStarted));
        log.info("Added transcription task to queue for file: {}. Queue size: {}",
                file.getOriginalFilename(), taskQueue.size());
        try {
            processingStarted.get();
            log.info("Processing started for file: {}, applying timeout of {} minutes",
                    file.getOriginalFilename(), PROCESSING_TIMEOUT);

            return resultFuture.get(PROCESSING_TIMEOUT, TimeUnit.MINUTES);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Error waiting for transcription results ", e);
            throw new Exception("Transcription process failed: " + e.getMessage());
        }

    }

    private MultipartFile copyMultipartFile(MultipartFile file) {
        try {
            return new CachedMultipartFile(file);
        } catch (IOException e) {
            log.error("Error copying MultipartFile", e);
            throw new RuntimeException("Failed to copy file data for queuing", e);
        }
    }

    private void startQueueProcessor() {

        executorService.submit(() -> {
            log.info("Starting Flask request queue processor");
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    TranscriptionTask task = taskQueue.take();
                    log.info("Processing transcription task for file: {}. Remaining tasks: {}",
                            task.file.getOriginalFilename(), taskQueue.size());

                    isProcessing.set(true);
                    try {
                        task.processingStarted.complete(null);
                        Map<String, Object> result = audioTranscriptionService.processAudio(task.file);
                        task.future.complete(result);
                        log.info("Completed transcription for file: {}", task.file.getOriginalFilename());
                    } catch (Exception e) {
                        log.error("Error processing transcription", e);
                        task.future.completeExceptionally(e);
                    } finally {
                        isProcessing.set(false);
                    }

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    log.error("Unexpected error in queue processor", e);
                }
            }
            log.info("Flask request queue processor shut down");
        });
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down Flask request queue");
        executorService.shutdownNow();
        try {
            if (!executorService.awaitTermination(PROCESSING_TIMEOUT, TimeUnit.SECONDS)) {
                log.warn("Queue processor did not terminate in time");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }


    private record TranscriptionTask(MultipartFile file,
                                     CompletableFuture<Map<String, Object>> future,
                                     CompletableFuture<Void> processingStarted) {
    }


}
