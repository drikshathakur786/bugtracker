package com.drikshathakur.bugtracker.repository;

import com.drikshathakur.bugtracker.entity.Project;
import com.drikshathakur.bugtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    // Find all projects where the user is the owner
    List<Project> findByOwner(User owner);

    // Find all projects where the user is a member OR the owner
    // This is a custom JPQL query — @Query lets you write your own
    // We need this because "user's projects" means both owned AND member of
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN ProjectMember pm ON pm.project = p " +
            "WHERE p.owner = :user OR pm.user = :user")
    List<Project> findAllProjectsForUser(@Param("user") User user);
}