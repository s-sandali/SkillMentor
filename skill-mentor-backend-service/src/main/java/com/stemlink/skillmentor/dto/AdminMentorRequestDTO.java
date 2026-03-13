package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminMentorRequestDTO {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Size(max = 100, message = "Profession must not exceed 100 characters")
    private String profession;

    @Size(max = 100, message = "Company must not exceed 100 characters")
    private String company;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years must be at least 0")
    @Max(value = 80, message = "Experience years must not exceed 80")
    private Integer experienceYears;

    @NotBlank(message = "Bio is required")
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    @Size(max = 1024, message = "Profile image URL must not exceed 1024 characters")
    private String profileImageUrl;

    @NotNull(message = "Certification status is required")
    private Boolean isCertified;

    @NotBlank(message = "Start year is required")
    @Pattern(regexp = "^\\d{4}$", message = "Start year must be a valid 4-digit year")
    private String startYear;
}
