package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.AdminMentorRequestDTO;
import com.stemlink.skillmentor.dto.response.*;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Review;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.ReviewRepository;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.services.MentorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final SessionRepository sessionRepository;
    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;

    @CacheEvict(value = "mentors", allEntries = true)
    public MentorResponseDTO createNewMentor(Mentor mentor) {
        try {
            Mentor saved = mentorRepository.save(mentor);
            return modelMapper.map(saved, MentorResponseDTO.class);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating mentor: {}", e.getMessage());
            throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create new mentor", exception);
            throw new SkillMentorException("Failed to create new mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @CacheEvict(value = "mentors", allEntries = true)
    public MentorResponseDTO createAdminMentor(AdminMentorRequestDTO requestDTO) {
        try {
            String normalizedEmail = requestDTO.getEmail().trim().toLowerCase();
            if (mentorRepository.findByEmail(normalizedEmail).isPresent()) {
                throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
            }

            Mentor mentor = modelMapper.map(requestDTO, Mentor.class);
            mentor.setFirstName(requestDTO.getFirstName().trim());
            mentor.setLastName(requestDTO.getLastName().trim());
            mentor.setEmail(normalizedEmail);
            mentor.setPhoneNumber(trimToNull(requestDTO.getPhoneNumber()));
            mentor.setTitle(trimToNull(requestDTO.getTitle()));
            mentor.setProfession(trimToNull(requestDTO.getProfession()));
            mentor.setCompany(trimToNull(requestDTO.getCompany()));
            mentor.setBio(requestDTO.getBio().trim());
            mentor.setProfileImageUrl(trimToNull(requestDTO.getProfileImageUrl()));
            mentor.setExperienceYears(requestDTO.getExperienceYears());
            mentor.setIsCertified(Boolean.TRUE.equals(requestDTO.getIsCertified()));
            mentor.setStartYear(requestDTO.getStartYear().trim());
            mentor.setMentorId("admin-" + UUID.randomUUID());
            mentor.setPositiveReviews(0);
            mentor.setTotalEnrollments(0);

            Mentor savedMentor = mentorRepository.save(mentor);
            log.info("Admin created mentor {} with id {}", savedMentor.getEmail(), savedMentor.getId());
            return modelMapper.map(savedMentor, MentorResponseDTO.class);
        } catch (SkillMentorException e) {
            log.warn("Failed to create admin mentor: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating admin mentor: {}", e.getMessage());
            throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create admin mentor", exception);
            throw new SkillMentorException("Failed to create mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "mentors", key = "(#name ?: '') + '_' + (#pageable != null ? #pageable.pageNumber : 0) + '_' + (#pageable != null ? #pageable.pageSize : 10)")
    public Page<MentorResponseDTO> getAllMentors(String name, Pageable pageable) {
        try {
            log.debug("getting mentors with name: {}", name);
            Page<Mentor> mentors = (name != null && !name.isEmpty())
                    ? mentorRepository.findByName(name, pageable)
                    : mentorRepository.findAll(pageable);
            return mentors.map(m -> modelMapper.map(m, MentorResponseDTO.class));
        } catch (Exception exception) {
            log.error("Failed to get all mentors", exception);
            throw new SkillMentorException("Failed to get all mentors", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Transactional(readOnly = true)
    @Cacheable(value = "mentors", key = "#id")
    public MentorResponseDTO getMentorById(Long id) {
        try {
            Mentor mentor = mentorRepository.findWithSubjectsById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );
            log.info("Successfully fetched mentor {}", id);
            return modelMapper.map(mentor, MentorResponseDTO.class);
        } catch (SkillMentorException skillMentorException) {
            log.warn("Mentor not found with id: {} to fetch", id, skillMentorException);
            throw skillMentorException;
        } catch (Exception exception) {
            log.error("Error getting mentor", exception);
            throw new SkillMentorException("Failed to get mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @CacheEvict(value = "mentors", allEntries = true)
    public MentorResponseDTO updateMentorById(Long id, Mentor updatedMentor, String requestingClerkId, boolean isAdmin) {
        try {
            Mentor mentor = mentorRepository.findWithSubjectsById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );

            if (!isAdmin && !mentor.getMentorId().equals(requestingClerkId)) {
                log.warn("User {} attempted to update mentor profile {} without permission", requestingClerkId, mentor.getMentorId());
                throw new SkillMentorException("You do not have permission to update this mentor's profile", HttpStatus.FORBIDDEN);
            }

            modelMapper.map(updatedMentor, mentor);
            Mentor saved = mentorRepository.save(mentor);
            return modelMapper.map(saved, MentorResponseDTO.class);
        } catch (SkillMentorException skillMentorException) {
            log.warn("SkillMentor exception while updating mentor id {}: {}", id, skillMentorException.getMessage());
            throw skillMentorException;
        } catch (Exception exception) {
            log.error("Error updating mentor", exception);
            throw new SkillMentorException("Failed to update mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public void deleteMentor(Long id) {
        try {
            mentorRepository.deleteById(id);
        } catch (Exception exception) {
            log.error("Failed to delete mentor with id {}", id, exception);
            throw new SkillMentorException("Failed to delete mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "mentorProfiles", key = "#mentorId")
    public MentorProfileResponseDTO getMentorProfile(Long mentorId) {
        try {
            // Fetch mentor with subjects eagerly loaded
            Mentor mentor = mentorRepository.findWithSubjectsById(mentorId)
                    .orElseThrow(() -> new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND));

            // Fetch all sessions for this mentor
            List<Session> allSessions = sessionRepository.findByMentor_Id(mentorId);

            // Fetch reviews for this mentor from the Review table
            List<Review> mentorReviews = reviewRepository.findByMentor_Id(mentorId);

            // Build MentorInfo
            MentorInfoDTO mentorInfo = buildMentorInfo(mentor);

            // Build MentorStats
            MentorStatsDTO mentorStats = buildMentorStats(mentor, allSessions, mentorReviews);

            // Build Subjects with enrollment counts
            List<SubjectWithEnrollmentDTO> subjects = buildSubjectsWithEnrollments(mentor.getSubjects(), allSessions);

            // Build Reviews
            List<ReviewDTO> reviews = buildReviews(mentorReviews);

            MentorProfileResponseDTO response = new MentorProfileResponseDTO();
            response.setMentorInfo(mentorInfo);
            response.setMentorStats(mentorStats);
            response.setSubjects(subjects);
            response.setReviews(reviews);

            log.info("Successfully built mentor profile for mentor id {}", mentorId);
            return response;

        } catch (SkillMentorException e) {
            log.warn("Failed to get mentor profile: {}", e.getMessage());
            throw e;
        } catch (Exception exception) {
            log.error("Failed to get mentor profile for id {}", mentorId, exception);
            throw new SkillMentorException("Failed to get mentor profile", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private MentorInfoDTO buildMentorInfo(Mentor mentor) {
        MentorInfoDTO info = new MentorInfoDTO();
        info.setId(mentor.getId());
        info.setMentorId(mentor.getMentorId());
        info.setName((mentor.getFirstName() + " " + mentor.getLastName()).trim());
        info.setTitle(mentor.getTitle());
        info.setProfession(mentor.getProfession());
        info.setCompany(mentor.getCompany());
        info.setProfileImage(mentor.getProfileImageUrl());
        info.setBio(mentor.getBio());
        info.setStartYear(mentor.getStartYear());
        info.setIsCertified(mentor.getIsCertified());
        return info;
    }

    private MentorStatsDTO buildMentorStats(Mentor mentor, List<Session> allSessions, List<Review> reviews) {
        MentorStatsDTO stats = new MentorStatsDTO();

        // Total unique students
        Set<Long> uniqueStudents = allSessions.stream()
                .filter(s -> s.getStudent() != null)
                .map(s -> s.getStudent().getId().longValue())
                .collect(Collectors.toSet());
        stats.setTotalStudents(uniqueStudents.size());

        // Years of experience
        stats.setYearsExperience(mentor.getExperienceYears());

        // Subjects count
        stats.setSubjectsCount(mentor.getSubjects() != null ? mentor.getSubjects().size() : 0);

        // Average rating and positive review percentage from Review table
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            stats.setAverageRating(Math.round(avgRating * 10.0) / 10.0);

            long positiveCount = reviews.stream()
                    .filter(r -> r.getRating() >= 4)
                    .count();
            double positivePercentage = (positiveCount * 100.0) / reviews.size();
            stats.setPositiveReviewPercentage(Math.round(positivePercentage * 10.0) / 10.0);
        } else {
            stats.setAverageRating(0.0);
            stats.setPositiveReviewPercentage(0.0);
        }

        return stats;
    }

    private List<SubjectWithEnrollmentDTO> buildSubjectsWithEnrollments(List<Subject> subjects, List<Session> allSessions) {
        if (subjects == null) {
            return new ArrayList<>();
        }

        // Count enrollments per subject, excluding cancelled sessions
        Map<Long, Long> enrollmentsBySubject = allSessions.stream()
                .filter(s -> s.getSubject() != null && s.getSessionStatus() != SessionStatus.CANCELLED)
                .collect(Collectors.groupingBy(
                        s -> s.getSubject().getId(),
                        Collectors.counting()
                ));

        return subjects.stream()
                .map(subject -> {
                    SubjectWithEnrollmentDTO dto = new SubjectWithEnrollmentDTO();
                    dto.setSubjectId(subject.getId());
                    dto.setSubjectName(subject.getName());
                    dto.setSubjectDescription(subject.getDescription());
                    dto.setThumbnail(subject.getCourseImageUrl());
                    dto.setEnrollmentCount(enrollmentsBySubject.getOrDefault(subject.getId(), 0L).intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private List<ReviewDTO> buildReviews(List<Review> reviews) {
        return reviews.stream()
                .map(r -> {
                    ReviewDTO dto = new ReviewDTO();
                    dto.setReviewId(r.getId());
                    dto.setStudentName(
                            r.getStudent() != null
                            ? (r.getStudent().getFirstName() + " " + r.getStudent().getLastName()).trim()
                            : "Anonymous"
                    );
                    dto.setRating(r.getRating());
                    dto.setReviewText(r.getReviewText());
                    dto.setReviewDate(r.getCreatedAt());
                    return dto;
                })
                .sorted(Comparator.comparing(ReviewDTO::getReviewDate).reversed())
                .collect(Collectors.toList());
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

}
