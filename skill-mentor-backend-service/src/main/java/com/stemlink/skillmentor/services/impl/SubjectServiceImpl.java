package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.SubjectRequestDTO;
import com.stemlink.skillmentor.dto.response.SubjectResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.services.SubjectService;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final MentorRepository mentorRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public SubjectResponseDTO createSubject(SubjectRequestDTO requestDTO) {
        try {
            Mentor mentor = mentorRepository.findById(requestDTO.getMentorId()).orElseThrow(
                    () -> new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND)
            );

            String normalizedName = requestDTO.getName().trim();
            String normalizedDescription = requestDTO.getDescription().trim();

            if (subjectRepository.existsByNameIgnoreCaseAndMentor_Id(normalizedName, mentor.getId())) {
                throw new SkillMentorException("Subject already exists for the selected mentor", HttpStatus.CONFLICT);
            }

            Subject subject = modelMapper.map(requestDTO, Subject.class);
            subject.setName(normalizedName);
            subject.setDescription(normalizedDescription);
            if (subject.getCourseImageUrl() != null && subject.getCourseImageUrl().isBlank()) {
                subject.setCourseImageUrl(null);
            }
            subject.setMentor(mentor);
            Subject savedSubject = subjectRepository.save(subject);

            SubjectResponseDTO responseDTO = modelMapper.map(savedSubject, SubjectResponseDTO.class);
            responseDTO.setMentorId(mentor.getId());
            responseDTO.setMentorName((mentor.getFirstName() + " " + mentor.getLastName()).trim());

            log.info("Subject created successfully with id {} for mentor {}", savedSubject.getId(), mentor.getId());
            return responseDTO;
        } catch (SkillMentorException e) {
            log.warn("Failed to create subject: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            String databaseMessage = e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage();
            log.error("Data integrity violation while creating subject: {}", databaseMessage);
            throw new SkillMentorException("Invalid subject data or database constraint violation", HttpStatus.BAD_REQUEST);
        } catch (Exception exception) {
            log.error("Failed to create subject", exception);
            throw new SkillMentorException("Failed to create subject", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Page<Subject> getAllSubjects(Pageable pageable){
        try {
            return subjectRepository.findAll(pageable);
        } catch (Exception exception) {
            log.error("Failed to get all subjects", exception);
            throw new SkillMentorException("Failed to get all subjects", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Subject addNewSubject(Long mentorId, Subject subject){
        try {
            Mentor mentor = mentorRepository.findByMentorId(String.valueOf(mentorId)).orElseThrow(
                    () -> new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND)
            );
            subject.setMentor(mentor);
            return subjectRepository.save(subject);
        } catch (SkillMentorException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while adding subject: {}", e.getMessage());
            throw new SkillMentorException("Subject already exists or database constraint violation", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to add new subject", exception);
            throw new SkillMentorException("Failed to add new subject", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Subject getSubjectById(Long id){
        return subjectRepository.findById(id).orElseThrow(
                () -> new SkillMentorException("Subject not found", HttpStatus.NOT_FOUND)
        );
    }

    public Subject updateSubjectById(Long id, Subject updatedSubject){
        try {
            Subject subject = subjectRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Subject not found", HttpStatus.NOT_FOUND)
            );
            modelMapper.map(updatedSubject, subject);
            return subjectRepository.save(subject);
        } catch (SkillMentorException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating subject: {}", e.getMessage());
            throw new SkillMentorException("Database constraint violation", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Error updating subject", exception);
            throw new SkillMentorException("Failed to update subject", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void deleteSubject(Long id){
        try {
            subjectRepository.deleteById(id);
        } catch (Exception exception) {
            log.error("Failed to delete subject with id {}", id, exception);
            throw new SkillMentorException("Failed to delete subject", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
