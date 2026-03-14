package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDTO {
    private String type; // "booking", "payment", "mentor", "subject"
    private String message;
    private LocalDateTime timestamp;
}
