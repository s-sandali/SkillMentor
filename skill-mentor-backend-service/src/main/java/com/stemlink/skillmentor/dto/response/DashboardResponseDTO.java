package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponseDTO {
    private Long totalSubjects;
    private Long totalMentors;
    private Long totalBookings;
    private List<ActivityDTO> recentActivities;
}
