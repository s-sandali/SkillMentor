package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.respositories.StudentRepository;
import com.stemlink.skillmentor.services.StudentService;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    public Student createNewStudent(Student student) {
        try {       
            return studentRepository.save(student);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating student: {}", e.getMessage());
            throw new SkillMentorException("Student with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create new student", exception);
            throw new SkillMentorException("Failed to create new student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO: add pagination
    public List<Student> getAllStudents() {
        try {
            return studentRepository.findAll();
        } catch (Exception exception) {
            log.error("Failed to get all students", exception);
            throw new SkillMentorException("Failed to get all students", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Student getStudentById(Integer id) {
        try {
            return studentRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND)
            );
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
            return studentRepository.save(student);
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
        } catch (Exception exception) {
            log.error("Failed to delete student with id {}", id, exception);
            throw new SkillMentorException("Failed to delete student", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
