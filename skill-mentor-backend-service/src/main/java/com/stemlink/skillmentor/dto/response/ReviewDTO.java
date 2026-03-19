package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long reviewId;
    private String studentName;
    private Integer rating;
    private String reviewText;
    private Date reviewDate;
}
