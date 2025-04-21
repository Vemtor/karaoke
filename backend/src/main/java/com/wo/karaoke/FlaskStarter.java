package com.wo.karaoke;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
@Profile({"default", "integration-test"})
public class FlaskStarter implements CommandLineRunner {

    @Value("${flask.server.script}")
    private String script;

    @Value("${venv:.venv}")
    private String venv;

    @Value("${flask.server.url}")
    private String flaskServerUrl;

    @Value("${flask.server.startup-timeout}")
    private int startupTimeout;

    private final AtomicBoolean serverStarted = new AtomicBoolean(false);
    private volatile Process process;

    @Override
    public void run(String... args) {
        log.info("Starting Flask server");

        String pythonExecutable;
        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            pythonExecutable = venv + "/Scripts/python";
        } else {
            pythonExecutable = venv + "/bin/python";
        }


        new Thread(() -> {
            try {
                ProcessBuilder pb = new ProcessBuilder(
                        pythonExecutable,
                        script
                );

                pb.redirectErrorStream(true);
                process = pb.start();

                startOutputReader();


                if (waitForServerToStart()) {
                    serverStarted.set(true);
                    log.info("Flask server is up and running!");
                } else {
                    log.error("Flask server failed to start within timeout period");
                }


                int exitCode = process.waitFor();
                log.info("Flask server process exited with code: {}", exitCode);
                serverStarted.set(false);

            } catch (Exception e) {
                log.error("Failed to start Flask server", e);
            }
        }).start();
    }

    private boolean waitForServerToStart() {
        log.info("Waiting for Flask server to start... Timeout: {} seconds", startupTimeout);
        long startTime = System.currentTimeMillis();
        long timeout = TimeUnit.SECONDS.toMillis(startupTimeout);

        while (System.currentTimeMillis() - startTime < timeout) {
            try {

                URL url = new URL(flaskServerUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setConnectTimeout(1000);
                connection.connect();
                return true;

            } catch (Exception e) {
                if (e.getMessage() != null && e.getMessage().contains("405")) {
                    return true;
                }

                try {
                    log.debug("Flask server not ready yet, retrying in 1 second...");
                    Thread.sleep(1000);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                    return false;
                }
            }
        }

        return false;
    }

    private void startOutputReader() {
        new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("[FLASK] {}", line);
                }
            } catch (Exception e) {
                log.error("Error reading Flask server output", e);
            }
        }).start();
    }


    public void stopServer() {
        if (process.isAlive()) {
            log.info("Stopping Flask server...");
            process.destroy();
        }

        try {
            boolean terminated = process.waitFor(5, TimeUnit.SECONDS);
            if (!terminated) {
                log.warn("Forcing shutdown of the flask server...");
                process.destroyForcibly();
            }
            serverStarted.set(false);
            log.info("Flask server has been stopped.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Interrupted while waiting for Flask server to stop", e);
        }
    }


    public boolean isServerRunning() {
        return serverStarted.get();
    }
}