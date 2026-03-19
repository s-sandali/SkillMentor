package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.ReviewRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorReviewsResponseDTO;
import com.stemlink.skillmentor.dto.response.ReviewResponseDTO;
import com.stemlink.skillmentor.security.UserPrincipal;

public interface ReviewService {

    ReviewResponseDTO submitReview(ReviewRequestDTO request, UserPrincipal userPrincipal);

    MentorReviewsResponseDTO getMentorReviews(Long mentorId);
}
