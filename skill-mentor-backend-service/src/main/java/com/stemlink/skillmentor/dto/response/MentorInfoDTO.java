package com.stemlink.skillmentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MentorInfoDTO {
    private Long id;
    private String name;
    private String title;
    private String profession;
    private String company;
    private String profileImage;
    private String bio;
    private String startYear;
    private Boolean isCertified;
}
