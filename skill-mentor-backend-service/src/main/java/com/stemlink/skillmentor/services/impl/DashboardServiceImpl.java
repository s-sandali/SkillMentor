package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.response.ActivityDTO;
import com.stemlink.skillmentor.dto.response.DashboardResponseDTO;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final SessionRepository sessionRepository;
    private final MentorRepository mentorRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public DashboardResponseDTO getAdminDashboard() {
        // Get total counts
        long totalSubjects = subjectRepository.count();
        long totalMentors = mentorRepository.count();
        long totalBookings = sessionRepository.count();

        // Get recent activities (last 10 items combined)
        List<ActivityDTO> recentActivities = new ArrayList<>();

        // Fetch recent sessions (bookings and payments)
        var recentSessions = sessionRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        recentSessions.forEach(session -> {
            // Add booking activity
            recentActivities.add(new ActivityDTO(
                    "booking",
                    String.format("New booking created by %s for %s session",
                            session.getStudent().getFirstName(),
                            session.getSubject().getName()),
                    convertToLocalDateTime(session.getCreatedAt())
            ));

            // Add payment activity if payment is confirmed
            if ("PAID".equalsIgnoreCase(session.getPaymentStatus())) {
                recentActivities.add(new ActivityDTO(
                        "payment",
                        String.format("Payment confirmed for %s mentorship",
                                session.getSubject().getName()),
                        convertToLocalDateTime(session.getUpdatedAt())
                ));
            }
        });

        // Fetch recent mentors
        var recentMentors = mentorRepository.findAll(
                PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        recentMentors.forEach(mentor -> {
            recentActivities.add(new ActivityDTO(
                    "mentor",
                    String.format("New mentor %s %s added to platform",
                            mentor.getFirstName(),
                            mentor.getLastName()),
                    convertToLocalDateTime(mentor.getCreatedAt())
            ));
        });

        // Fetch recent subjects
        var recentSubjects = subjectRepository.findAll(
                PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        recentSubjects.forEach(subject -> {
            recentActivities.add(new ActivityDTO(
                    "subject",
                    String.format("New subject '%s' created",
                            subject.getName()),
                    convertToLocalDateTime(subject.getCreatedAt())
            ));
        });

        // Sort all activities by timestamp (most recent first) and limit to 10
        recentActivities.sort(Comparator.comparing(ActivityDTO::getTimestamp).reversed());
        List<ActivityDTO> limitedRecentActivities = recentActivities.size() > 10
                ? new ArrayList<>(recentActivities.subList(0, 10))
                : recentActivities;

        return new DashboardResponseDTO(totalSubjects, totalMentors, totalBookings, limitedRecentActivities);
    }

    private LocalDateTime convertToLocalDateTime(java.util.Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
