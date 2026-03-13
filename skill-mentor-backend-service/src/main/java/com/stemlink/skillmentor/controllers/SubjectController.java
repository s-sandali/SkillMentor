package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.SubjectDTO;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.services.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/subjects")
@RequiredArgsConstructor
@Validated
@PreAuthorize("isAuthenticated()")
public class SubjectController extends AbstractController {

    private final ModelMapper modelMapper;
    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<Page<Subject>> getAllSubjects(Pageable pageable) {
        return sendOkResponse(subjectService.getAllSubjects(pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        return sendOkResponse(subjectService.getSubjectById(id));
    }

//    @PostMapping
//    public Subject createSubject(@Valid @RequestBody Subject subject) {
//        Long mentorId = 1L;
//
//        // check validation
//        if(subject.getSubjectName().length() < 3){
//            return null;
//        }
//        return subjectService.addNewSubject(mentorId, subject);
//    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody SubjectDTO subjectDTO) {
        Subject subject = modelMapper.map(subjectDTO, Subject.class);
        return sendCreatedResponse(subjectService.addNewSubject(subjectDTO.getMentorId(), subject));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectDTO updatedSubjectDTO) {
        Subject subject = modelMapper.map(updatedSubjectDTO, Subject.class);
        return sendOkResponse(subjectService.updateSubjectById(id, subject));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return sendNoContentResponse();
    }
}
