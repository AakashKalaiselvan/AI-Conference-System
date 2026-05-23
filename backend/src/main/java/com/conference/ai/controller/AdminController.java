package com.conference.ai.controller;

import com.conference.ai.dto.ApiResponse;
import com.conference.ai.dto.SubmissionResponse;
import com.conference.ai.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/submissions")
@RequiredArgsConstructor
public class AdminController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved", submissionService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Submission retrieved", submissionService.getById(id)));
    }
}
