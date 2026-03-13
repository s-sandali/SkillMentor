package com.stemlink.skillmentor.controllers;


import com.stemlink.skillmentor.dto.SessionDTO;
import com.stemlink.skillmentor.dto.response.SessionResponseDTO;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.security.UserPrincipal;
import com.stemlink.skillmentor.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping(path = "/api/v1/sessions")
@RequiredArgsConstructor
@Validated
@PreAuthorize("isAuthenticated()")
public class SessionController extends AbstractController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<Page<Session>> getAllSessions(Pageable pageable) {
        return sendOkResponse(sessionService.getAllSessions(pageable));
    }

    @GetMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        return sendOkResponse(sessionService.getSessionById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Session> createSession(@Valid @RequestBody SessionDTO sessionDTO) {
        return sendCreatedResponse(sessionService.createNewSession(sessionDTO));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @Valid @RequestBody SessionDTO updatedSessionDTO) {
        return sendOkResponse(sessionService.updateSessionById(id, updatedSessionDTO));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return sendNoContentResponse();
    }

    // Enrollment endpoint for students to enroll in a session
    @PostMapping("/enroll")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<Session> enrollSession(
            @Valid @RequestBody SessionDTO sessionDTO,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Session session = sessionService.enrollSession(userPrincipal, sessionDTO);
        return sendCreatedResponse(session);
    }

    // Fetch sessions specific to the signed-in student
    @GetMapping("/my-sessions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<SessionResponseDTO>> getMySessions(Authentication authentication, Pageable pageable) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Page<Session> sessions = sessionService.getSessionsByStudentEmail(userPrincipal.getEmail(), pageable);
        Page<SessionResponseDTO> response = sessions.map(this::toSessionResponseDTO);
        return sendOkResponse(response);
    }

    private SessionResponseDTO toSessionResponseDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        dto.setMentorName(session.getMentor().getFirstName() + " " + session.getMentor().getLastName());
        dto.setMentorProfileImageUrl(session.getMentor().getProfileImageUrl());
        dto.setSubjectName(session.getSubject().getSubjectName());
        dto.setSessionAt(session.getSessionAt());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setSessionStatus(session.getSessionStatus());
        dto.setPaymentStatus(session.getPaymentStatus());
        dto.setMeetingLink(session.getMeetingLink());
        return dto;
    }
}
