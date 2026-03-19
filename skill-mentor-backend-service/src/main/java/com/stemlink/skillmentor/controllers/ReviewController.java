package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.ReviewRequestDTO;
import com.stemlink.skillmentor.dto.response.ReviewResponseDTO;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.security.UserPrincipal;
import com.stemlink.skillmentor.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController extends AbstractController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> submitReview(
            @Valid @RequestBody ReviewRequestDTO request,
            Authentication authentication) {

        if (!(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            throw new SkillMentorException("Invalid authentication principal", HttpStatus.UNAUTHORIZED);
        }

        ReviewResponseDTO response = reviewService.submitReview(request, userPrincipal);
        return sendCreatedResponse(response);
    }
}
