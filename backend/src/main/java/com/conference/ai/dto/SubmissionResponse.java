package com.conference.ai.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private Long id;
    private String presentingAuthorName;
    private String coAuthorNames;
    private String email;
    private String country;
    private String whatsappNumber;
    private String participationType;
    private String sessionSuggestion;
    private String abstractTitle;
    private String abstractFilePath;
    private String aiSuggestedSession;
    private LocalDateTime createdAt;
}
