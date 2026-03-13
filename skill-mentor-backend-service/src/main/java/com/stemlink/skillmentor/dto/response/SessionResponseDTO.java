package com.stemlink.skillmentor.dto.response;

import com.stemlink.skillmentor.entities.SessionStatus;
import lombok.Data;

import java.util.Date;

@Data
public class SessionResponseDTO {
    private Long id;
    private String mentorName;
    private String mentorProfileImageUrl;
    private String subjectName;
    private Date sessionAt;
    private Integer durationMinutes;
    private SessionStatus sessionStatus;
    private String paymentStatus;
    private String meetingLink;
}
