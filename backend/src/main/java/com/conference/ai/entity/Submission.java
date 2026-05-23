package com.conference.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String presentingAuthorName;

    private String coAuthorNames;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String country;

    private String whatsappNumber;

    @Column(nullable = false)
    private String participationType;

    private String sessionSuggestion;

    @Column(nullable = false)
    private String abstractTitle;

    private String abstractFilePath;

    private String aiSuggestedSession;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
