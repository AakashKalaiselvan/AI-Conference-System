package com.conference.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiAiService {

    private static final String FALLBACK_RESPONSE = "Unable to determine session. Please try again.";

    private static final String PROMPT_TEMPLATE = """
            You are a conference session classifier. Based on the following abstract text, determine the single best matching conference session from this list:
            
            - Artificial Intelligence
            - Machine Learning
            - Data Science
            - Cybersecurity
            - Cloud Computing
            - IoT
            - Blockchain
            - Robotics
            - Healthcare Technology
            - Life Sciences
            - Sustainable Engineering
            
            Rules:
            - Return ONLY the session name
            - No JSON
            - No explanation
            - No additional text
            
            Abstract:
            %s
            """;

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String model;

    public GeminiAiService(
            @Value("${google.ai.api.key}") String apiKey,
            @Value("${google.ai.model}") String model,
            RestTemplateBuilder restTemplateBuilder) {
        this.apiKey = apiKey;
        this.model = model;
        // Configure timeouts: 10s connect, 30s read
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
    }

    /**
     * Sends extracted abstract text to Gemini API and returns the recommended session name.
     * Falls back gracefully if the API call fails or times out.
     */
    public String recommendSession(String abstractText) {
        log.info("GeminiAiService.recommendSession() called | input text length={} characters", abstractText.length());

        try {
            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    model, apiKey);

            // Build Gemini API request body
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", String.format(PROMPT_TEMPLATE, abstractText))
                            ))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            log.info("Sending request to Gemini API | model={}", model);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            log.info("Gemini API response received | status={}", response.getStatusCode());

            String result = extractTextFromResponse(response.getBody());
            log.info("Gemini AI recommended session: '{}'", result);
            return result;

        } catch (RestClientException e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return FALLBACK_RESPONSE;
        } catch (Exception e) {
            log.error("Unexpected error during Gemini AI call: {}", e.getMessage());
            return FALLBACK_RESPONSE;
        }
    }

    /**
     * Parses the Gemini API response to extract the generated text content.
     */
    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> responseBody) {
        if (responseBody == null) {
            log.warn("Gemini API returned null response body");
            return FALLBACK_RESPONSE;
        }

        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");
            return text != null ? text.trim() : FALLBACK_RESPONSE;
        } catch (Exception e) {
            log.error("Failed to parse Gemini API response: {}", e.getMessage());
            return FALLBACK_RESPONSE;
        }
    }
}
