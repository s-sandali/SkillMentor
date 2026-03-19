package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.AdminMeetingLinkRequestDTO;
import com.stemlink.skillmentor.dto.CreateSessionRequest;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.exceptions.BookingConflictException;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.StudentRepository;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.dto.SessionDTO;
import com.stemlink.skillmentor.dto.response.AdminSessionResponseDTO;
import com.stemlink.skillmentor.security.UserPrincipal;
import com.stemlink.skillmentor.services.SessionService;
import com.stemlink.skillmentor.utils.ValidationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final StudentRepository studentRepository;
    private final MentorRepository mentorRepository;
    private final SubjectRepository subjectRepository;
    private final ModelMapper modelMapper;

    public Session createNewSession(SessionDTO sessionDTO) {
        // Fetch the related entities by their IDs
        try {
            Student student = studentRepository.findById(sessionDTO.getStudentId()).orElseThrow(
                    () -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND)
            );
            Mentor mentor = mentorRepository.findByMentorId(sessionDTO.getMentorId()).orElseThrow(
                    () -> new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND)
            );
            Subject subject = subjectRepository.findById(sessionDTO.getSubjectId()).orElseThrow(
                    () -> new SkillMentorException("Subject not found", HttpStatus.NOT_FOUND)
            );

            validateSessionCreation(student, mentor, subject, sessionDTO.getSessionAt(), sessionDTO.getDurationMinutes());


            // Create and populate the Session entity
//        Session session = new Session();
//        session.setSessionAt(sessionDTO.getSessionAt());
//        session.setDurationMinutes(sessionDTO.getDurationMinutes());
//        session.setSessionStatus(sessionDTO.getSessionStatus());
//        session.setMeetingLink(sessionDTO.getMeetingLink());
//        session.setSessionNotes(sessionDTO.getSessionNotes());
//        session.setStudentReview(sessionDTO.getStudentReview());
//        session.setStudentRating(sessionDTO.getStudentRating());

            // using model mapper
            Session session = modelMapper.map(sessionDTO, Session.class);
            session.setStudent(student);
            session.setMentor(mentor);
            session.setSubject(subject);


            return sessionRepository.save(session);
        } catch (SkillMentorException skillMentorException) {
            log.error("Dependencies not found to map: {}, Failed to create new session", skillMentorException.getMessage());
            throw skillMentorException;
        } catch (Exception exception) {
            log.error("Failed to create session", exception);
            throw new SkillMentorException("Failed to create new session", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public Page<Session> getAllSessions(Pageable pageable) {
        try {
            return sessionRepository.findAll(pageable);
        } catch (Exception exception) {
            log.error("Failed to get all sessions", exception);
            throw new SkillMentorException("Failed to get all sessions", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Session getSessionById(Long id) {
        try {
            return sessionRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Session not found", HttpStatus.NOT_FOUND)
            );
        } catch (SkillMentorException e) {
            log.warn("Session not found with id: {}", id);
            throw e;
        } catch (Exception exception) {
            log.error("Error getting session with id: {}", id, exception);
            throw new SkillMentorException("Failed to get session", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Session updateSessionById(Long id, SessionDTO updatedSessionDTO) {
        try {
            Session session = sessionRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Session not found", HttpStatus.NOT_FOUND)
            );

            // source -> destination
            modelMapper.map(updatedSessionDTO, session);

            // Update the related entities
            if (updatedSessionDTO.getStudentId() != null) {
                Student student = studentRepository.findById(updatedSessionDTO.getStudentId()).orElseThrow(
                        () -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND)
                );
                session.setStudent(student);
            }
            if (updatedSessionDTO.getMentorId() != null) {
                Mentor mentor = mentorRepository.findByMentorId(updatedSessionDTO.getMentorId())
                        .orElseThrow(() -> new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND));
                session.setMentor(mentor);
            }
            if (updatedSessionDTO.getSubjectId() != null) {
                Subject subject = subjectRepository.findById(updatedSessionDTO.getSubjectId()).orElseThrow(
                        () -> new SkillMentorException("Subject not found", HttpStatus.NOT_FOUND)
                );
                session.setSubject(subject);
            }

//        // Update other fields
//        if (updatedSessionDTO.getSessionAt() != null) {
//            session.setSessionAt(updatedSessionDTO.getSessionAt());
//        }
//        if (updatedSessionDTO.getDurationMinutes() != null) {
//            session.setDurationMinutes(updatedSessionDTO.getDurationMinutes());
//        }
//        if (updatedSessionDTO.getSessionStatus() != null) {
//            session.setSessionStatus(updatedSessionDTO.getSessionStatus());
//        }
//        if (updatedSessionDTO.getMeetingLink() != null) {
//            session.setMeetingLink(updatedSessionDTO.getMeetingLink());
//        }
//        if (updatedSessionDTO.getSessionNotes() != null) {
//            session.setSessionNotes(updatedSessionDTO.getSessionNotes());
//        }
//        if (updatedSessionDTO.getStudentReview() != null) {
//            session.setStudentReview(updatedSessionDTO.getStudentReview());
//        }
//        if (updatedSessionDTO.getStudentRating() != null) {
//            session.setStudentRating(updatedSessionDTO.getStudentRating());
//        }

            return sessionRepository.save(session);
        } catch (SkillMentorException e) {
            log.warn("Dependency not found while updating session id: {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception exception) {
            log.error("Error updating session with id: {}", id, exception);
            throw new SkillMentorException("Failed to update session", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void deleteSession(Long id) {
        try {
            sessionRepository.deleteById(id);
        } catch (Exception exception) {
            log.error("Failed to delete session with id {}", id, exception);
            throw new SkillMentorException("Failed to delete session", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Page<AdminSessionResponseDTO> getAdminSessions(String search, String paymentStatus, String sessionStatus, String dateFrom, String dateTo, Pageable pageable) {
        try {
            String normalizedSearch = normalizeSearch(search);
            String normalizedPaymentStatus = normalizePaymentStatus(paymentStatus);
            SessionStatus normalizedSessionStatus = normalizeSessionStatus(sessionStatus);
            Date parsedDateFrom = parseDate(dateFrom, false);
            Date parsedDateTo = parseDate(dateTo, true);

            return sessionRepository
                    .findAll(buildAdminSessionSpecification(normalizedSearch, normalizedPaymentStatus, normalizedSessionStatus, parsedDateFrom, parsedDateTo), pageable)
                    .map(this::toAdminSessionResponseDTO);
        } catch (SkillMentorException e) {
            throw e;
        } catch (Exception exception) {
            log.error("Failed to fetch admin sessions", exception);
            throw new SkillMentorException("Failed to fetch sessions", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public AdminSessionResponseDTO confirmPayment(Long id) {
        try {
            Session session = getSessionById(id);
            session.setPaymentStatus("accepted");
            Session updatedSession = sessionRepository.save(session);
            log.info("Confirmed payment for session {}", id);
            return toAdminSessionResponseDTO(updatedSession);
        } catch (SkillMentorException e) {
            log.warn("Unable to confirm payment for session {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception exception) {
            log.error("Failed to confirm payment for session {}", id, exception);
            throw new SkillMentorException("Failed to confirm payment", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public AdminSessionResponseDTO completeSession(Long id) {
        try {
            Session session = getSessionById(id);
            session.setSessionStatus(SessionStatus.COMPLETED);
            Session updatedSession = sessionRepository.save(session);
            log.info("Marked session {} as completed", id);
            return toAdminSessionResponseDTO(updatedSession);
        } catch (SkillMentorException e) {
            log.warn("Unable to complete session {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception exception) {
            log.error("Failed to complete session {}", id, exception);
            throw new SkillMentorException("Failed to complete session", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public AdminSessionResponseDTO updateMeetingLink(Long id, AdminMeetingLinkRequestDTO requestDTO) {
        try {
            Session session = getSessionById(id);
            session.setMeetingLink(requestDTO.getMeetingLink().trim());
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated meeting link for session {}", id);
            return toAdminSessionResponseDTO(updatedSession);
        } catch (SkillMentorException e) {
            log.warn("Unable to update meeting link for session {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception exception) {
            log.error("Failed to update meeting link for session {}", id, exception);
            throw new SkillMentorException("Failed to update meeting link", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public Session enrollSession(UserPrincipal userPrincipal, CreateSessionRequest request) {
        // Find student by email from JWT, or auto-create user on first enrollment
        Student student = studentRepository.findByEmail(userPrincipal.getEmail())
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setStudentId(userPrincipal.getId());
                    s.setEmail(userPrincipal.getEmail());
                    s.setFirstName(userPrincipal.getFirstName());
                    s.setLastName(userPrincipal.getLastName());
                    return studentRepository.save(s);
                });

        Mentor mentor = mentorRepository.findByMentorId(request.getMentorId().trim())
                .orElseThrow(() -> new SkillMentorException("Mentor not found with mentorId: " + request.getMentorId(), HttpStatus.NOT_FOUND));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new SkillMentorException("Subject not found with id: " + request.getSubjectId(), HttpStatus.NOT_FOUND));

        validateEnrollmentRequest(student, mentor, subject, request);

        Session session = new Session();
        session.setStudent(student);
        session.setMentor(mentor);
        session.setSubject(subject);
        session.setSessionAt(request.getSessionDateTime());
        session.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60);
        session.setSessionStatus(SessionStatus.SCHEDULED);
        session.setPaymentStatus("pending");

        return sessionRepository.save(session);
    }

    public Page<Session> getSessionsByStudentEmail(String email, Pageable pageable) {
        return sessionRepository.findByStudent_Email(email, pageable);
    }

    private AdminSessionResponseDTO toAdminSessionResponseDTO(Session session) {
        AdminSessionResponseDTO dto = new AdminSessionResponseDTO();
        dto.setSessionId(session.getId());
        if (session.getStudent() != null) {
            dto.setStudentName(buildFullName(session.getStudent().getFirstName(), session.getStudent().getLastName()));
        }
        if (session.getMentor() != null) {
            dto.setMentorName(buildFullName(session.getMentor().getFirstName(), session.getMentor().getLastName()));
        }
        if (session.getSubject() != null) {
            dto.setSubjectName(session.getSubject().getName() != null ? session.getSubject().getName() : session.getSubject().getSubjectName());
        }
        dto.setDate(session.getSessionAt());
        dto.setDuration(session.getDurationMinutes());
        dto.setPaymentStatus(session.getPaymentStatus());
        dto.setSessionStatus(session.getSessionStatus());
        dto.setMeetingLink(session.getMeetingLink());
        return dto;
    }

    private String buildFullName(String firstName, String lastName) {
        String safeFirstName = firstName != null ? firstName : "";
        String safeLastName = lastName != null ? lastName : "";
        return (safeFirstName + " " + safeLastName).trim();
    }

    private String normalizeSearch(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizePaymentStatus(String value) {
        String normalized = normalizeSearch(value);
        return normalized == null ? null : normalized.toLowerCase();
    }

    private SessionStatus normalizeSessionStatus(String value) {
        String normalized = normalizeSearch(value);
        if (normalized == null) {
            return null;
        }

        try {
            return SessionStatus.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new SkillMentorException("Invalid session status", HttpStatus.BAD_REQUEST);
        }
    }

    private Specification<Session> buildAdminSessionSpecification(
            String search,
            String paymentStatus,
            SessionStatus sessionStatus,
            Date dateFrom,
            Date dateTo) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Avoid duplicate rows when joins are present
            if (Boolean.FALSE.equals(query.isDistinct())) {
                query.distinct(true);
            }

            if (search != null) {
                String pattern = "%" + search.toLowerCase() + "%";
                var studentJoin = root.join("student", JoinType.LEFT);
                var mentorJoin = root.join("mentor", JoinType.LEFT);
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(studentJoin.get("firstName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(studentJoin.get("lastName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(mentorJoin.get("firstName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(mentorJoin.get("lastName")), pattern)
                ));
            }

            if (paymentStatus != null) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("paymentStatus")), paymentStatus));
            }

            if (sessionStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("sessionStatus"), sessionStatus));
            }

            if (dateFrom != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sessionAt"), dateFrom));
            }

            if (dateTo != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sessionAt"), dateTo));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Date parseDate(String dateStr, boolean endOfDay) {
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }
        try {
            LocalDate localDate = LocalDate.parse(dateStr);
            if (endOfDay) {
                return Date.from(localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            }
            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        } catch (DateTimeParseException e) {
            throw new SkillMentorException("Invalid date format. Use ISO format: yyyy-MM-dd", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateEnrollmentRequest(Student student, Mentor mentor, Subject subject, CreateSessionRequest request) {
        try {
            int durationMinutes = request.getDurationMinutes() != null ? request.getDurationMinutes() : 60;
            validateSessionCreation(student, mentor, subject, request.getSessionDateTime(), durationMinutes);
        } catch (SkillMentorException exception) {
            log.warn("Booking validation failed for student {} and mentor {}: {}",
                    student.getEmail(), mentor.getMentorId(), exception.getMessage());
            throw exception;
        }
    }

    private void validateSessionCreation(Student student, Mentor mentor, Subject subject, java.util.Date sessionDateTime, Integer durationMinutes) {
        ValidationUtils.validateSessionTimeInFuture(sessionDateTime);
        ValidationUtils.validateSubjectBelongsToMentor(subject, mentor);
        ValidationUtils.validateDuplicateSubjectBooking(student, subject, sessionDateTime, durationMinutes);
        ValidationUtils.validateMentorAvailability(mentor, sessionDateTime, durationMinutes);
        ValidationUtils.validateStudentAvailability(student, sessionDateTime, durationMinutes);
    }

}
