package com.stemlink.skillmentor.controllers;


import com.stemlink.skillmentor.dto.CreateSessionRequest;
import com.stemlink.skillmentor.dto.SessionDTO;
import com.stemlink.skillmentor.dto.response.SessionResponseDTO;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
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
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping(path = "/api/v1/sessions")
@RequiredArgsConstructor
@Validated
@PreAuthorize("isAuthenticated()")
public class SessionController extends AbstractController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<Page<SessionResponseDTO>> getAllSessions(Pageable pageable) {
        Page<SessionResponseDTO> response = sessionService.getAllSessions(pageable).map(this::toSessionResponseDTO);
        return sendOkResponse(response);
    }

    @GetMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SessionResponseDTO> getSessionById(@PathVariable("id") Long id) {
        Session session = sessionService.getSessionById(id);
        return sendOkResponse(toSessionResponseDTO(session));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Session> createSession(@Valid @RequestBody SessionDTO sessionDTO) {
        return sendCreatedResponse(sessionService.createNewSession(sessionDTO));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    public ResponseEntity<Session> updateSession(@PathVariable("id") Long id, @Valid @RequestBody SessionDTO updatedSessionDTO) {
        return sendOkResponse(sessionService.updateSessionById(id, updatedSessionDTO));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable("id") Long id) {
        sessionService.deleteSession(id);
        return sendNoContentResponse();
    }

    // Enrollment endpoint for students to enroll in a session
    @PostMapping("/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Session> enrollSession(
            @Valid @RequestBody CreateSessionRequest request,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Session session = sessionService.enrollSession(userPrincipal, request);
        return sendCreatedResponse(session);
    }

    // Fetch sessions specific to the signed-in student
    @GetMapping("/my-sessions")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<Page<SessionResponseDTO>> getMySessions(Authentication authentication, Pageable pageable) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        if (userPrincipal == null || userPrincipal.getEmail() == null) {
            throw new SkillMentorException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Page<Session> sessions = sessionService.getSessionsByStudentEmail(userPrincipal.getEmail(), pageable);
        Page<SessionResponseDTO> response = sessions.map(this::toSessionResponseDTO);
        return sendOkResponse(response);
    }

    private SessionResponseDTO toSessionResponseDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        if (session.getMentor() != null) {
            String firstName = session.getMentor().getFirstName() != null ? session.getMentor().getFirstName() : "";
            String lastName = session.getMentor().getLastName() != null ? session.getMentor().getLastName() : "";
            dto.setMentorName((firstName + " " + lastName).trim());
            dto.setMentorProfileImageUrl(session.getMentor().getProfileImageUrl());
        }
        if (session.getSubject() != null) {
            dto.setSubjectName(session.getSubject().getSubjectName());
        }
        dto.setSessionAt(session.getSessionAt());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setSessionStatus(session.getSessionStatus());
        dto.setPaymentStatus(session.getPaymentStatus());
        dto.setMeetingLink(session.getMeetingLink());
        return dto;
    }
}
