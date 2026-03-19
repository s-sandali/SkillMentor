package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.AdminMeetingLinkRequestDTO;
import com.stemlink.skillmentor.dto.response.AdminSessionResponseDTO;
import com.stemlink.skillmentor.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/admin/sessions")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminSessionController extends AbstractController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<Page<AdminSessionResponseDTO>> getAdminSessions(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "paymentStatus", required = false) String paymentStatus,
            @RequestParam(name = "sessionStatus", required = false) String sessionStatus,
            @RequestParam(name = "dateFrom", required = false) String dateFrom,
            @RequestParam(name = "dateTo", required = false) String dateTo,
            Pageable pageable) {
        return sendOkResponse(sessionService.getAdminSessions(search, paymentStatus, sessionStatus, dateFrom, dateTo, normalizePageable(pageable)));
    }

    @PatchMapping("{id}/confirm-payment")
    public ResponseEntity<AdminSessionResponseDTO> confirmPayment(@PathVariable("id") Long id) {
        return sendOkResponse(sessionService.confirmPayment(id));
    }

    @PatchMapping("{id}/complete")
    public ResponseEntity<AdminSessionResponseDTO> completeSession(@PathVariable("id") Long id) {
        return sendOkResponse(sessionService.completeSession(id));
    }

    @PatchMapping("{id}/meeting-link")
    public ResponseEntity<AdminSessionResponseDTO> updateMeetingLink(
            @PathVariable("id") Long id,
            @Valid @RequestBody AdminMeetingLinkRequestDTO requestDTO) {
        return sendOkResponse(sessionService.updateMeetingLink(id, requestDTO));
    }

    private Pageable normalizePageable(Pageable pageable) {
        Sort normalizedSort = pageable.getSort().isSorted()
                ? Sort.by(pageable.getSort().stream()
                .map(order -> new Sort.Order(order.getDirection(), mapSortProperty(order.getProperty())))
                .toList())
                : Sort.by(Sort.Order.desc("sessionAt"));

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), normalizedSort);
    }

    private String mapSortProperty(String property) {
        return switch (property) {
            case "date" -> "sessionAt";
            case "duration" -> "durationMinutes";
            case "studentName" -> "student.firstName";
            case "mentorName" -> "mentor.firstName";
            case "subjectName" -> "subject.name";
            default -> property;
        };
    }
}
