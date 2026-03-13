package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.entities.Subject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubjectService {
    Page<Subject> getAllSubjects(Pageable pageable);
    Subject addNewSubject(Long mentorId, Subject subject);
    Subject getSubjectById(Long id);
    Subject updateSubjectById(Long id, Subject updatedSubject);
    void deleteSubject(Long id);
}
