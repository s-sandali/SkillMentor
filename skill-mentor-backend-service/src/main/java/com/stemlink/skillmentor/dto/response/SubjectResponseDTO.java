package com.stemlink.skillmentor.dto.response;

import lombok.Data;

@Data
public class SubjectResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String courseImageUrl;
    private Long mentorId;
    private String mentorName;
}