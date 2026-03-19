package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MentorStatsDTO {
    private Integer totalStudents;
    private Integer yearsExperience;
    private Integer subjectsCount;
    private Double averageRating;
    private Double positiveReviewPercentage;
}
