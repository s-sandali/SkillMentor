package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class CreateSessionRequest {

    @NotBlank(message = "Mentor ID is required")
    private String mentorId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Session date/time is required")
    private Date sessionDateTime;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;
}
