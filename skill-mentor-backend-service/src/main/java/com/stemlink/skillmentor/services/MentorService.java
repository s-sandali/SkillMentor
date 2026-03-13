package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.AdminMentorRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MentorService {
    Mentor createNewMentor(Mentor mentor);
    MentorResponseDTO createAdminMentor(AdminMentorRequestDTO requestDTO);
    Page<Mentor> getAllMentors(String name, Pageable pageable);
    Mentor getMentorById(Long id);
    Mentor updateMentorById(Long id, Mentor updatedMentor, String requestingClerkId, boolean isAdmin);
    void deleteMentor(Long id);
}
