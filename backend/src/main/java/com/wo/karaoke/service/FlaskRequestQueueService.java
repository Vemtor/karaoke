package com.wo.karaoke.service;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
public class FlaskRequestQueueService {

    private static final int PROCESSING_TIMEOUT_MINUTES = 7;

    private final FlaskRequestExecutor flaskRequestExecutor;

    private final BlockingQueue<FlaskTask> taskQueue = new LinkedBlockingQueue<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private final AtomicBoolean isRunning = new AtomicBoolean(true);

    public FlaskRequestQueueService(FlaskRequestExecutor flaskRequestExecutor) {
        this.flaskRequestExecutor = flaskRequestExecutor;
        startProcessor();
    }

    public Map<String, Object> queueFlaskRequest(String youtubeUrl, String serverUrl) throws Exception {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();
        taskQueue.add(new FlaskTask(youtubeUrl, serverUrl, future));
        log.info("Queued request to Flask for URL: {}", youtubeUrl);

        try {
            return future.get(PROCESSING_TIMEOUT_MINUTES, TimeUnit.MINUTES);
        } catch (TimeoutException e) {
            log.error("Timeout while processing Flask request", e);
            throw new Exception("Flask request timed out after " + PROCESSING_TIMEOUT_MINUTES + " minutes");
        } catch (Exception e) {
            log.error("Error while processing Flask request", e);
            throw new Exception("Flask request failed: " + e.getMessage(), e);
        }
    }

    private void startProcessor() {
        executorService.submit(() -> {
            log.info("Flask request queue processor started");
            while (isRunning.get()) {
                try {
                    FlaskTask task = taskQueue.take();
                    log.info("Processing Flask request for: {}", task.youtubeUrl);

                    try {
                        Map<String, Object> result = flaskRequestExecutor.processAudio(task.youtubeUrl, task.serverUrl);
                        task.future.complete(result);
                    } catch (Exception e) {
                        task.future.completeExceptionally(e);
                    }

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    log.error("Unexpected error in Flask queue processor", e);
                }
            }
            log.info("Flask request queue processor stopped");
        });
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down Flask request queue");
        isRunning.set(false);
        executorService.shutdownNow();
        try {
            if (!executorService.awaitTermination(10, TimeUnit.SECONDS)) {
                log.warn("Flask queue processor did not terminate cleanly");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static class FlaskTask {
        final String youtubeUrl;
        final String serverUrl;
        final CompletableFuture<Map<String, Object>> future;

        public FlaskTask(String youtubeUrl, String serverUrl, CompletableFuture<Map<String, Object>> future) {
            this.youtubeUrl = youtubeUrl;
            this.serverUrl = serverUrl;
            this.future = future;
        }
    }
}
