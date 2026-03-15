package com.drikshathakur.bugtracker.controller;

import com.drikshathakur.bugtracker.dto.response.AnalyticsSummaryResponse;
import com.drikshathakur.bugtracker.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/projects/{projectId}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Returns total bugs, open count, closed count, bugs by severity
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @PathVariable UUID projectId) {
        return ResponseEntity.ok(analyticsService.getSummary(projectId));
    }

    // Returns bug count per assignee
    @GetMapping("/by-assignee")
    public ResponseEntity<List<Map<String, Object>>> getByAssignee(
            @PathVariable UUID projectId) {
        return ResponseEntity.ok(analyticsService.getByAssignee(projectId));
    }

    // Returns bug count per status
    @GetMapping("/by-status")
    public ResponseEntity<List<Map<String, Object>>> getByStatus(
            @PathVariable UUID projectId) {
        return ResponseEntity.ok(analyticsService.getByStatus(projectId));
    }
}