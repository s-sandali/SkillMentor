package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.AdminMentorRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.services.MentorService;
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
@RequestMapping(path = "/api/v1/admin/mentors")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminMentorController extends AbstractController {

    private final MentorService mentorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MentorResponseDTO> createMentor(@Valid @RequestBody AdminMentorRequestDTO requestDTO) {
        return sendCreatedResponse(mentorService.createAdminMentor(requestDTO));
    }
}
