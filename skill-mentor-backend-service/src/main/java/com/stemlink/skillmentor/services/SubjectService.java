package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.SubjectRequestDTO;
import com.stemlink.skillmentor.dto.response.SubjectResponseDTO;
import com.stemlink.skillmentor.entities.Subject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubjectService {
    SubjectResponseDTO createSubject(SubjectRequestDTO requestDTO);
    Page<Subject> getAllSubjects(Pageable pageable);
    Subject addNewSubject(Long mentorId, Subject subject);
    Subject getSubjectById(Long id);
    Subject updateSubjectById(Long id, Subject updatedSubject);
    void deleteSubject(Long id);
}
