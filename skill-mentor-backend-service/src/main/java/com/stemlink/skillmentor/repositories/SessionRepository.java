package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
    Page<Session> findByStudent_Email(String email, Pageable pageable);
}
