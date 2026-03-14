package com.drikshathakur.bugtracker.controller;

import com.drikshathakur.bugtracker.dto.request.AddCommentRequest;
import com.drikshathakur.bugtracker.dto.request.CreateBugRequest;
import com.drikshathakur.bugtracker.dto.request.UpdateBugRequest;
import com.drikshathakur.bugtracker.dto.response.AuditLogResponse;
import com.drikshathakur.bugtracker.dto.response.BugResponse;
import com.drikshathakur.bugtracker.dto.response.CommentResponse;
import com.drikshathakur.bugtracker.entity.Bug;
import com.drikshathakur.bugtracker.entity.User;
import com.drikshathakur.bugtracker.service.BugService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bugs")
@RequiredArgsConstructor
public class BugController {

    private final BugService bugService;

    @PostMapping
    public ResponseEntity<BugResponse> createBug(
            @Valid @RequestBody CreateBugRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bugService.createBug(request, currentUser));
    }

    // @RequestParam are optional query parameters: /api/bugs?projectId=xxx&status=OPEN
    @GetMapping
    public ResponseEntity<List<BugResponse>> getBugs(
            @RequestParam UUID projectId,
            @RequestParam(required = false) Bug.Status status,
            @RequestParam(required = false) Bug.Severity severity,
            @RequestParam(required = false) UUID assigneeId) {
        return ResponseEntity.ok(bugService.getBugs(projectId, status, severity, assigneeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BugResponse> getBug(@PathVariable UUID id) {
        return ResponseEntity.ok(bugService.getBugById(id));
    }

    // PATCH is used for partial updates — you only send the fields you want to change
    @PatchMapping("/{id}")
    public ResponseEntity<BugResponse> updateBug(
            @PathVariable UUID id,
            @RequestBody UpdateBugRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(bugService.updateBug(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable UUID id) {
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable UUID id,
            @Valid @RequestBody AddCommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bugService.addComment(id, request, currentUser));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable UUID id) {
        return ResponseEntity.ok(bugService.getComments(id));
    }

    @GetMapping("/{id}/audit")
    public ResponseEntity<List<AuditLogResponse>> getAuditLog(@PathVariable UUID id) {
        return ResponseEntity.ok(bugService.getAuditLog(id));
    }
}