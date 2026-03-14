package com.drikshathakur.bugtracker.repository;

import com.drikshathakur.bugtracker.entity.AuditLog;
import com.drikshathakur.bugtracker.entity.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    // Get full audit history for a bug, ordered by oldest first
    List<AuditLog> findByBugOrderByTimestampAsc(Bug bug);
}