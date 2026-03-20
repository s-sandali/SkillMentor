package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.Date;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    @Override
    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    Page<Session> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    Page<Session> findAll(Specification<Session> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    java.util.Optional<Session> findById(Long id);

    Page<Session> findByStudent_Email(String email, Pageable pageable);

    @EntityGraph(attributePaths = {"student", "subject"})
    java.util.List<Session> findByMentor_Id(Long mentorId);

    @EntityGraph(attributePaths = {"student"})
    java.util.List<Session> findByMentor_IdAndStudentRatingIsNotNull(Long mentorId);

    /**
     * Fetch active sessions (not CANCELLED, not COMPLETED) that started before the given cutoff.
     * The scheduler will further filter by whether sessionAt + durationMinutes has passed.
     */
    @Query("SELECT s FROM Session s WHERE s.sessionStatus NOT IN :excludedStatuses AND s.sessionAt < :cutoffTime")
    List<Session> findActiveSessionsStartedBefore(
            @Param("excludedStatuses") List<SessionStatus> excludedStatuses,
            @Param("cutoffTime") Date cutoffTime
    );
}
