package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MentorProfileResponseDTO {
    private MentorInfoDTO mentorInfo;
    private MentorStatsDTO mentorStats;
    private List<SubjectWithEnrollmentDTO> subjects;
    private List<ReviewDTO> reviews;
}
