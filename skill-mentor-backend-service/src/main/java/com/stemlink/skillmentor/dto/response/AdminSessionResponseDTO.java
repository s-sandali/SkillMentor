package com.stemlink.skillmentor.dto.response;

import com.stemlink.skillmentor.entities.SessionStatus;
import lombok.Data;

import java.util.Date;

@Data
public class AdminSessionResponseDTO {
    private Long sessionId;
    private String studentName;
    private String mentorName;
    private String subjectName;
    private Date date;
    private Integer duration;
    private String paymentStatus;
    private SessionStatus sessionStatus;
    private String meetingLink;
}
