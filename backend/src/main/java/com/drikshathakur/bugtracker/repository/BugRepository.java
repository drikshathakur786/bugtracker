package com.drikshathakur.bugtracker.repository;

import com.drikshathakur.bugtracker.entity.Bug;
import com.drikshathakur.bugtracker.entity.Project;
import com.drikshathakur.bugtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
// JpaSpecificationExecutor lets us build dynamic filters (status, severity, etc.)
public interface BugRepository extends JpaRepository<Bug, UUID>,
        JpaSpecificationExecutor<Bug> {

    List<Bug> findByProject(Project project);

    List<Bug> findByAssignee(User assignee);
}