package com.stemlink.skillmentor.dto.response;

import lombok.Data;

@Data
public class MentorResponseDTO {
    private Long id;
    private String mentorId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String title;
    private String profession;
    private String company;
    private Integer experienceYears;
    private String bio;
    private String profileImageUrl;
    private Boolean isCertified;
    private String startYear;
    private Integer positiveReviews;
    private Integer totalEnrollments;
}
