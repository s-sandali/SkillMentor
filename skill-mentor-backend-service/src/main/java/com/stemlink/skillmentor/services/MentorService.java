package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.AdminMentorRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorProfileResponseDTO;
import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MentorService {
    MentorResponseDTO createNewMentor(Mentor mentor);
    MentorResponseDTO createAdminMentor(AdminMentorRequestDTO requestDTO);
    Page<MentorResponseDTO> getAllMentors(String name, Pageable pageable);
    MentorResponseDTO getMentorById(Long id);
    MentorResponseDTO updateMentorById(Long id, Mentor updatedMentor, String requestingClerkId, boolean isAdmin);
    void deleteMentor(Long id);
    MentorProfileResponseDTO getMentorProfile(Long mentorId);
}
