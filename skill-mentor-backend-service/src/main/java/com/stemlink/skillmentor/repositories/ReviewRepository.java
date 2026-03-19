package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsBySession_Id(Long sessionId);

    @EntityGraph(attributePaths = {"student", "session"})
    List<Review> findByMentor_Id(Long mentorId);

    Optional<Review> findBySession_Id(Long sessionId);
}
