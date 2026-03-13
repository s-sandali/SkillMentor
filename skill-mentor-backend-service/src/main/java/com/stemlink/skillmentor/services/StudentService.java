package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.entities.Student;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {

    Student createNewStudent(Student student);
    Page<Student> getAllStudents(Pageable pageable);
    Student getStudentById(Integer id);
    Student updateStudentById(Integer id, Student updatedStudent, String requestingClerkId, boolean isAdmin);
    void deleteStudent(Integer id);
}
