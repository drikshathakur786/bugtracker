package com.drikshathakur.bugtracker.dto.response;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {

    private long totalBugs;
    private long openBugs;
    private long inProgressBugs;
    private long inReviewBugs;
    private long closedBugs;

    // Map of severity -> count e.g. {"CRITICAL": 2, "HIGH": 5, "MEDIUM": 3, "LOW": 1}
    private Map<String, Long> bugsBySeverity;

    // Map of type -> count e.g. {"BUG": 5, "TASK": 3}
    private Map<String, Long> bugsByType;
}