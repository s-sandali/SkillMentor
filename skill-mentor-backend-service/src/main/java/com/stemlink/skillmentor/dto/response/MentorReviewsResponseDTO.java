package com.stemlink.skillmentor.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class MentorReviewsResponseDTO {
    private List<ReviewResponseDTO> reviews;
    private Double averageRating;
    private Integer totalReviews;
}
