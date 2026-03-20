package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.ReviewRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorReviewsResponseDTO;
import com.stemlink.skillmentor.dto.response.ReviewResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Review;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.ReviewRepository;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.StudentRepository;
import com.stemlink.skillmentor.security.UserPrincipal;
import com.stemlink.skillmentor.services.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final SessionRepository sessionRepository;
    private final StudentRepository studentRepository;
    private final MentorRepository mentorRepository;
    private final CacheManager cacheManager;

    @Override
    @Transactional
    public ReviewResponseDTO submitReview(ReviewRequestDTO request, UserPrincipal userPrincipal) {
        // 1. Find the session
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new SkillMentorException("Session not found", HttpStatus.NOT_FOUND));

        // 2. Session must be COMPLETED
        if (session.getSessionStatus() != SessionStatus.COMPLETED) {
            throw new SkillMentorException(
                    "You can only review a session after it has been completed",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 3. The requesting student must be the session's student
        Student student = studentRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new SkillMentorException("Student not found", HttpStatus.NOT_FOUND));

        if (!session.getStudent().getId().equals(student.getId())) {
            throw new SkillMentorException(
                    "You can only review sessions that you attended",
                    HttpStatus.FORBIDDEN
            );
        }

        // 4. Prevent duplicate reviews per session
        if (reviewRepository.existsBySession_Id(session.getId())) {
            throw new SkillMentorException(
                    "You have already submitted a review for this session",
                    HttpStatus.CONFLICT
            );
        }

        // 5. Save the review
        Review review = new Review();
        review.setSession(session);
        review.setMentor(session.getMentor());
        review.setStudent(student);
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());

        Review saved = reviewRepository.save(review);
        log.info("Student {} submitted review for session {}", student.getEmail(), session.getId());

        // Update denormalized positiveReviews % on the Mentor entity
        Long mentorId = session.getMentor().getId();
        updateMentorPositiveReviews(mentorId);

        // Evict only this mentor's cached profile and reviews
        evictMentorCache(mentorId);

        return toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "mentorReviews", key = "#mentorId")
    public MentorReviewsResponseDTO getMentorReviews(Long mentorId) {
        if (!mentorRepository.existsById(mentorId)) {
            throw new SkillMentorException("Mentor not found", HttpStatus.NOT_FOUND);
        }

        List<Review> reviews = reviewRepository.findByMentor_Id(mentorId);

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        MentorReviewsResponseDTO response = new MentorReviewsResponseDTO();
        response.setReviews(reviewDTOs);
        response.setAverageRating(Math.round(averageRating * 10.0) / 10.0);
        response.setTotalReviews(reviews.size());

        return response;
    }

    private void updateMentorPositiveReviews(Long mentorId) {
        mentorRepository.findById(mentorId).ifPresent(mentor -> {
            List<Review> allReviews = reviewRepository.findByMentor_Id(mentorId);
            if (allReviews.isEmpty()) return;
            long positiveCount = allReviews.stream().filter(r -> r.getRating() >= 4).count();
            int percentage = (int) Math.round((positiveCount * 100.0) / allReviews.size());
            mentor.setPositiveReviews(percentage);
            mentorRepository.save(mentor);
            log.debug("Updated mentor {} positiveReviews to {}%", mentorId, percentage);
        });
    }

    private void evictMentorCache(Long mentorId) {
        Cache profileCache = cacheManager.getCache("mentorProfiles");
        Cache reviewCache = cacheManager.getCache("mentorReviews");
        Cache mentorsCache = cacheManager.getCache("mentors");
        if (profileCache != null) profileCache.evict(mentorId);
        if (reviewCache != null) reviewCache.evict(mentorId);
        if (mentorsCache != null) mentorsCache.clear(); // list cache uses composite keys
    }

    private ReviewResponseDTO toResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setReviewId(review.getId());
        dto.setSessionId(review.getSession().getId());
        dto.setMentorId(review.getMentor().getId());
        dto.setStudentName(
                review.getStudent() != null
                ? (review.getStudent().getFirstName() + " " + review.getStudent().getLastName()).trim()
                : "Anonymous"
        );
        dto.setRating(review.getRating());
        dto.setReviewText(review.getReviewText());
        dto.setReviewDate(review.getCreatedAt());
        return dto;
    }
}
