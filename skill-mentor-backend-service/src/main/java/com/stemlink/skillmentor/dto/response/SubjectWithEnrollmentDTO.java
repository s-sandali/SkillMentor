package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectWithEnrollmentDTO {
    private Long subjectId;
    private String subjectName;
    private String subjectDescription;
    private String thumbnail;
    private Integer enrollmentCount;
}
