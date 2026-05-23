package com.conference.ai.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class StartupLogger implements CommandLineRunner {

    @Value("${ai.enabled}")
    private boolean aiEnabled;

    @Value("${google.ai.model}")
    private String aiModel;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${server.port}")
    private String serverPort;

    @Override
    public void run(String... args) {
        log.info("=== AI Conference System Started ===");
        log.info("Server port: {}", serverPort);
        log.info("AI enabled: {}", aiEnabled);
        log.info("AI model: {}", aiEnabled ? aiModel : "N/A (fallback mode)");
        log.info("Upload directory: {}", uploadDir);
        log.info("====================================");
    }
}
