package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminMeetingLinkRequestDTO {

    @NotBlank(message = "Meeting link is required")
    @Size(max = 1024, message = "Meeting link must not exceed 1024 characters")
    private String meetingLink;
}
