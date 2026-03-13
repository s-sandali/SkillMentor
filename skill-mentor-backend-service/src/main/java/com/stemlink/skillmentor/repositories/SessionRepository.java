package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Session;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    @Override
    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    Page<Session> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    java.util.Optional<Session> findById(Long id);

    Page<Session> findByStudent_Email(String email, Pageable pageable);

    @EntityGraph(attributePaths = {"student", "mentor", "subject"})
    @Query("""
            SELECT s
            FROM Session s
            JOIN s.student st
            JOIN s.mentor m
            JOIN s.subject sub
            WHERE (:search IS NULL
                   OR LOWER(CONCAT(COALESCE(st.firstName, ''), ' ', COALESCE(st.lastName, ''))) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(CONCAT(COALESCE(m.firstName, ''), ' ', COALESCE(m.lastName, ''))) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(COALESCE(sub.name, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR STR(s.id) LIKE CONCAT('%', :search, '%'))
              AND (:paymentStatus IS NULL OR LOWER(COALESCE(s.paymentStatus, '')) = LOWER(:paymentStatus))
              AND (:sessionStatus IS NULL OR UPPER(COALESCE(CAST(s.sessionStatus as string), '')) = UPPER(:sessionStatus))
            """)
    Page<Session> findAdminSessions(
            @Param("search") String search,
            @Param("paymentStatus") String paymentStatus,
            @Param("sessionStatus") String sessionStatus,
            Pageable pageable);
}
