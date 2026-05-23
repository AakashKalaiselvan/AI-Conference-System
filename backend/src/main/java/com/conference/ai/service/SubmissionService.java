package com.conference.ai.service;

import com.conference.ai.dto.SubmissionRequest;
import com.conference.ai.dto.SubmissionResponse;
import com.conference.ai.entity.Submission;
import com.conference.ai.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final SubmissionRepository submissionRepository;
    private final AbstractExtractionService abstractExtractionService;
    private final GeminiAiService geminiAiService;
    private final FallbackRecommendationService fallbackRecommendationService;

    @org.springframework.beans.factory.annotation.Value("${file.upload-dir}")
    private String uploadDir;

    @org.springframework.beans.factory.annotation.Value("${ai.enabled}")
    private boolean aiEnabled;

    public SubmissionResponse submit(SubmissionRequest request, MultipartFile file) {
        Submission entity = Submission.builder()
                .presentingAuthorName(request.getPresentingAuthorName())
                .coAuthorNames(request.getCoAuthorNames())
                .email(request.getEmail())
                .country(request.getCountry())
                .whatsappNumber(request.getWhatsappNumber())
                .participationType(request.getParticipationType())
                .sessionSuggestion(request.getSessionSuggestion())
                .aiSuggestedSession(request.getAiSuggestedSession())
                .abstractTitle(request.getAbstractTitle())
                .build();

        if (file != null && !file.isEmpty()) {
            validateFile(file);
            entity.setAbstractFilePath(saveFile(file));
        }

        return toResponse(submissionRepository.save(entity));
    }

    public List<SubmissionResponse> getAll() {
        return submissionRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SubmissionResponse getById(Long id) {
        return submissionRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + id));
    }

    public String analyzeAbstract(MultipartFile file) {
        log.info("SubmissionService.analyzeAbstract() called | file={} | aiEnabled={}", file.getOriginalFilename(), aiEnabled);

        // Extract text from uploaded file
        log.info("Extracting text from file...");
        String extractedText = abstractExtractionService.extractText(file);
        log.info("Text extraction complete | extracted {} characters", extractedText.length());

        // Route to AI or fallback based on configuration
        String session;
        if (aiEnabled) {
            log.info("AI mode enabled — calling GeminiAiService.recommendSession()");
            session = geminiAiService.recommendSession(extractedText);
        } else {
            log.info("AI mode disabled — using FallbackRecommendationService");
            session = fallbackRecommendationService.recommendSession(extractedText);
        }

        log.info("Session recommendation result: '{}'", session);
        return session;
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only PDF and DOCX files are allowed.");
        }
    }

    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private SubmissionResponse toResponse(Submission entity) {
        return SubmissionResponse.builder()
                .id(entity.getId())
                .presentingAuthorName(entity.getPresentingAuthorName())
                .coAuthorNames(entity.getCoAuthorNames())
                .email(entity.getEmail())
                .country(entity.getCountry())
                .whatsappNumber(entity.getWhatsappNumber())
                .participationType(entity.getParticipationType())
                .sessionSuggestion(entity.getSessionSuggestion())
                .abstractTitle(entity.getAbstractTitle())
                .abstractFilePath(entity.getAbstractFilePath())
                .aiSuggestedSession(entity.getAiSuggestedSession())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
