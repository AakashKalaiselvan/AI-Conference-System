package com.conference.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
public class FallbackRecommendationService {

    private static final String DEFAULT_SESSION = "Artificial Intelligence";

    // Keyword-to-session mapping (order matters — first match wins)
    private static final Map<String, String> KEYWORD_MAP = new LinkedHashMap<>() {{
        put("machine learning", "Machine Learning");
        put("deep learning", "Machine Learning");
        put("neural network", "Machine Learning");
        put("data science", "Data Science");
        put("data analytics", "Data Science");
        put("big data", "Data Science");
        put("cybersecurity", "Cybersecurity");
        put("cyber security", "Cybersecurity");
        put("encryption", "Cybersecurity");
        put("cloud computing", "Cloud Computing");
        put("cloud", "Cloud Computing");
        put("serverless", "Cloud Computing");
        put("internet of things", "IoT");
        put("iot", "IoT");
        put("sensor", "IoT");
        put("blockchain", "Blockchain");
        put("distributed ledger", "Blockchain");
        put("smart contract", "Blockchain");
        put("robotics", "Robotics");
        put("robot", "Robotics");
        put("autonomous", "Robotics");
        put("healthcare", "Healthcare Technology");
        put("medical", "Healthcare Technology");
        put("clinical", "Healthcare Technology");
        put("life science", "Life Sciences");
        put("biology", "Life Sciences");
        put("genomics", "Life Sciences");
        put("sustainable", "Sustainable Engineering");
        put("renewable", "Sustainable Engineering");
        put("green energy", "Sustainable Engineering");
        put("artificial intelligence", "Artificial Intelligence");
        put("ai", "Artificial Intelligence");
        put("nlp", "Artificial Intelligence");
        put("natural language", "Artificial Intelligence");
    }};

    /**
     * Recommends a session based on keyword matching against the abstract text.
     * Returns a default session if no keywords match.
     */
    public String recommendSession(String abstractText) {
        log.info("FallbackRecommendationService.recommendSession() called | text length={}", abstractText.length());

        String lowerText = abstractText.toLowerCase();

        for (Map.Entry<String, String> entry : KEYWORD_MAP.entrySet()) {
            if (lowerText.contains(entry.getKey())) {
                log.info("Fallback matched keyword='{}' → session='{}'", entry.getKey(), entry.getValue());
                return entry.getValue();
            }
        }

        log.info("No keyword match found, returning default session='{}'", DEFAULT_SESSION);
        return DEFAULT_SESSION;
    }
}
