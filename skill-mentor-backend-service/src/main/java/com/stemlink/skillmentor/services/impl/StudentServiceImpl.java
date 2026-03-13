package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.repositories.StudentRepository;
import com.stemlink.skillmentor.services.StudentService;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    public Student createNewStudent(Student student) {
        try {       
            Student savedStudent = studentRepository.save(student);
            log.info("Successfully created student: {}", savedStudent.getStudentId());
            return savedStudent;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating student: {}", e.getMessage());
            throw new SkillMentorException("Student with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create new student", exception);
            throw new SkillMentorException("Failed to create new student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Page<Student> getAllStudents(Pageable pageable) {
        try {
            log.info("Fetching a page of students");
            return studentRepository.findAll(pageable);
        } catch (Exception exception) {
            log.error("Failed to get all students", exception);
            throw new SkillMentorException("Failed to get all students", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Student getStudentById(Integer id) {
        try {
            Student student = studentRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND)
            );
            log.info("Successfully fetched student {}", id);
            return student;
        } catch (SkillMentorException e) {
            throw e;
        } catch (Exception exception) {
            log.error("Failed to get student id {}", id, exception);
            throw new SkillMentorException("Failed to get student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Student updateStudentById(Integer id, Student updatedStudent, String requestingClerkId, boolean isAdmin) {
        try {
            Student student = studentRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND)
            );

            if (!isAdmin && !student.getStudentId().equals(requestingClerkId)) {
                log.warn("User {} attempted to update student profile {} without permission", requestingClerkId, student.getStudentId());
                throw new SkillMentorException("You do not have permission to update this student's profile", HttpStatus.FORBIDDEN);
            }

            modelMapper.map(updatedStudent, student);
            Student savedStudent = studentRepository.save(student);
            log.info("Successfully updated student {}", id);
            return savedStudent;
        } catch (SkillMentorException e) {
            throw e;
        } catch (Exception exception) {
            log.error("Failed to update student id {}", id, exception);
            throw new SkillMentorException("Failed to update student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void deleteStudent(Integer id) {
        try {
            studentRepository.deleteById(id);
            log.info("Successfully deleted student {}", id);
        } catch (Exception exception) {
            log.error("Failed to delete student with id {}", id, exception);
            throw new SkillMentorException("Failed to delete student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
