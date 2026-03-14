package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.AdminMeetingLinkRequestDTO;
import com.stemlink.skillmentor.dto.CreateSessionRequest;
import com.stemlink.skillmentor.dto.SessionDTO;
import com.stemlink.skillmentor.dto.response.AdminSessionResponseDTO;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.security.UserPrincipal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SessionService {

    Session createNewSession(SessionDTO sessionDTO);
    Page<Session> getAllSessions(Pageable pageable);
    Session getSessionById(Long id);
    Session updateSessionById(Long id, SessionDTO updatedSessionDTO);
    void deleteSession(Long id);
    Page<AdminSessionResponseDTO> getAdminSessions(String search, String paymentStatus, String sessionStatus, Pageable pageable);
    AdminSessionResponseDTO confirmPayment(Long id);
    AdminSessionResponseDTO completeSession(Long id);
    AdminSessionResponseDTO updateMeetingLink(Long id, AdminMeetingLinkRequestDTO requestDTO);

    // Frontend enrollment flow — student is resolved from the Clerk JWT
    Session enrollSession(UserPrincipal userPrincipal, CreateSessionRequest request);
    Page<Session> getSessionsByStudentEmail(String email, Pageable pageable);
}
