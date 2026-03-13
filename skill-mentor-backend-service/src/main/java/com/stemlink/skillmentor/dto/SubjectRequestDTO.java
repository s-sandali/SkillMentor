package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubjectRequestDTO {

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String courseImageUrl;

    @NotNull(message = "Mentor ID is required")
    private Long mentorId;
}