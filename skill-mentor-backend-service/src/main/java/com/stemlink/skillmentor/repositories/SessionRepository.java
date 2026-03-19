package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Session;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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
}
