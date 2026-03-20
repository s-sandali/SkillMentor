package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.MentorDTO;
import com.stemlink.skillmentor.dto.response.MentorProfileResponseDTO;
import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.dto.response.MentorReviewsResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.security.UserPrincipal;
import com.stemlink.skillmentor.services.MentorService;
import com.stemlink.skillmentor.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.stemlink.skillmentor.constants.UserRoles.*;

@RestController
@RequestMapping(path = "/api/v1/mentors")
@RequiredArgsConstructor
@Validated
//@PreAuthorize("isAuthenticated()") // Allow all authenticated users to access mentor endpoints, but specific actions are further restricted by method-level security annotations
public class MentorController extends AbstractController {

    private final MentorService mentorService;
    private final ReviewService reviewService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<Page<MentorResponseDTO>> getAllMentors(
            @RequestParam(name = "name", required = false) String name,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return sendOkResponse(mentorService.getAllMentors(name, pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<MentorResponseDTO> getMentorById(@PathVariable Long id) {
        return sendOkResponse(mentorService.getMentorById(id));
    }

    @GetMapping("{mentorId}/profile")
    public ResponseEntity<MentorProfileResponseDTO> getMentorProfile(@PathVariable Long mentorId) {
        MentorProfileResponseDTO profile = mentorService.getMentorProfile(mentorId);
        return sendOkResponse(profile);
    }

    @GetMapping("{mentorId}/reviews")
    public ResponseEntity<MentorReviewsResponseDTO> getMentorReviews(@PathVariable Long mentorId) {
        return sendOkResponse(reviewService.getMentorReviews(mentorId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('" + ROLE_ADMIN + "', '" + ROLE_MENTOR + "')")
    public ResponseEntity<MentorResponseDTO> createMentor(@Valid @RequestBody MentorDTO mentorDTO, Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            throw new com.stemlink.skillmentor.exceptions.SkillMentorException("Invalid authentication principal", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }

        Mentor mentor = modelMapper.map(mentorDTO, Mentor.class);

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin || mentorDTO.getMentorId() == null) {
            // MENTOR role, or ADMIN without explicit identity fields in body → use JWT claims
            mentor.setMentorId(userPrincipal.getId());
            mentor.setFirstName(userPrincipal.getFirstName());
            mentor.setLastName(userPrincipal.getLastName());
            mentor.setEmail(userPrincipal.getEmail());
        }
        // else: ADMIN provided mentorId (+ firstName/lastName/email) in body → ModelMapper already mapped them

        return sendCreatedResponse(mentorService.createNewMentor(mentor));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('" + ROLE_ADMIN + "', '" + ROLE_MENTOR + "')")
    public ResponseEntity<MentorResponseDTO> updateMentor(@PathVariable Long id, @Valid @RequestBody MentorDTO updatedMentorDTO, Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            throw new com.stemlink.skillmentor.exceptions.SkillMentorException("Invalid authentication principal", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Mentor mentor = modelMapper.map(updatedMentorDTO, Mentor.class);
        return sendOkResponse(mentorService.updateMentorById(id, mentor, userPrincipal.getId(), isAdmin));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyRole('" + ROLE_ADMIN + "')")
    public ResponseEntity<Mentor> deleteMentor(@PathVariable Long id) {
        mentorService.deleteMentor(id);
        return sendNoContentResponse();
    }
}
