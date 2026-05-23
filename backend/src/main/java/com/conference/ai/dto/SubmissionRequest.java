package com.conference.ai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRequest {

    @NotBlank(message = "Presenting author name is required")
    private String presentingAuthorName;

    private String coAuthorNames;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Country is required")
    private String country;

    private String whatsappNumber;

    @NotBlank(message = "Participation type is required")
    private String participationType;

    private String sessionSuggestion;

    private String aiSuggestedSession;

    @NotBlank(message = "Abstract title is required")
    private String abstractTitle;
}
