package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.SubjectRequestDTO;
import com.stemlink.skillmentor.dto.response.SubjectResponseDTO;
import com.stemlink.skillmentor.services.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/admin/subjects")
@RequiredArgsConstructor
@Validated
public class AdminSubjectController extends AbstractController {

    private final SubjectService subjectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponseDTO> createSubject(@Valid @RequestBody SubjectRequestDTO requestDTO) {
        return sendCreatedResponse(subjectService.createSubject(requestDTO));
    }
}