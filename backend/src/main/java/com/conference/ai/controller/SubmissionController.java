package com.conference.ai.controller;

import com.conference.ai.dto.ApiResponse;
import com.conference.ai.dto.SubmissionRequest;
import com.conference.ai.dto.SubmissionResponse;
import com.conference.ai.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SubmissionResponse>> submit(
            @Valid @ModelAttribute SubmissionRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        log.info("REST request received: POST /api/submissions | author={}", request.getPresentingAuthorName());
        SubmissionResponse response = submissionService.submit(request, file);
        log.info("Response sent to frontend: Submission created with id={}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Submission created successfully", response));
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> analyze(
            @RequestParam("file") MultipartFile file) {
        log.info("REST request received: POST /api/submissions/analyze | file={}", file.getOriginalFilename());
        String suggestion = submissionService.analyzeAbstract(file);
        log.info("Response sent to frontend: AI suggested session='{}'", suggestion);
        return ResponseEntity.ok(ApiResponse.ok("Analysis complete", suggestion));
    }
}
