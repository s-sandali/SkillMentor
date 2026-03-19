package com.stemlink.skillmentor.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewResponseDTO {
    private Long id;
    private Long sessionId;
    private Long mentorId;
    private String studentName;
    private Integer rating;
    private String reviewText;
    private Date createdAt;
}
