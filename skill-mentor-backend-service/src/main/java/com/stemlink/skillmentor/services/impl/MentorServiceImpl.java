package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.AdminMentorRequestDTO;
import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.services.MentorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final ModelMapper modelMapper;

    @CacheEvict(value = "mentors", allEntries = true)
    public Mentor createNewMentor(Mentor mentor) {
        try {
            return mentorRepository.save(mentor);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating mentor: {}", e.getMessage());
            throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create new mentor", exception);
            throw new SkillMentorException("Failed to create new mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @CacheEvict(value = "mentors", allEntries = true)
    public MentorResponseDTO createAdminMentor(AdminMentorRequestDTO requestDTO) {
        try {
            String normalizedEmail = requestDTO.getEmail().trim().toLowerCase();
            if (mentorRepository.findByEmail(normalizedEmail).isPresent()) {
                throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
            }

            Mentor mentor = modelMapper.map(requestDTO, Mentor.class);
            mentor.setFirstName(requestDTO.getFirstName().trim());
            mentor.setLastName(requestDTO.getLastName().trim());
            mentor.setEmail(normalizedEmail);
            mentor.setPhoneNumber(trimToNull(requestDTO.getPhoneNumber()));
            mentor.setTitle(trimToNull(requestDTO.getTitle()));
            mentor.setProfession(trimToNull(requestDTO.getProfession()));
            mentor.setCompany(trimToNull(requestDTO.getCompany()));
            mentor.setBio(requestDTO.getBio().trim());
            mentor.setProfileImageUrl(trimToNull(requestDTO.getProfileImageUrl()));
            mentor.setExperienceYears(requestDTO.getExperienceYears());
            mentor.setIsCertified(Boolean.TRUE.equals(requestDTO.getIsCertified()));
            mentor.setStartYear(requestDTO.getStartYear().trim());
            mentor.setMentorId("admin-" + UUID.randomUUID());
            mentor.setPositiveReviews(0);
            mentor.setTotalEnrollments(0);

            Mentor savedMentor = mentorRepository.save(mentor);
            log.info("Admin created mentor {} with id {}", savedMentor.getEmail(), savedMentor.getId());
            return modelMapper.map(savedMentor, MentorResponseDTO.class);
        } catch (SkillMentorException e) {
            log.warn("Failed to create admin mentor: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating admin mentor: {}", e.getMessage());
            throw new SkillMentorException("Mentor with this email already exists", HttpStatus.CONFLICT);
        } catch (Exception exception) {
            log.error("Failed to create admin mentor", exception);
            throw new SkillMentorException("Failed to create mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Cacheable(value = "mentors", key = "(#name ?: '') + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Mentor> getAllMentors(String name, Pageable pageable) {
        try {
            log.debug("getting mentors with name: {}", name);
            if (name != null && !name.isEmpty()) {
                return mentorRepository.findByName(name, pageable);
            }
            return mentorRepository.findAll(pageable); // SELECT * FROM mentor
        } catch (Exception exception) {
            log.error("Failed to get all mentors", exception);
            throw new SkillMentorException("Failed to get all mentors", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Cacheable(value = "mentors", key = "#id")
    public Mentor getMentorById(Long id) {
        try {

            Mentor mentor = mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );
            log.info("Successfully fetched mentor {}", id);
            return mentor;
        } catch (SkillMentorException skillMentorException) {
            //System.err.println("Mentor not found " + skillMentorException.getMessage());
            // LOG LEVELS
            // DEBUG, INFO, WARN, ERROR
            // env - dev, prod
            log.warn("Mentor not found with id: {} to fetch", id, skillMentorException);
            throw new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            log.error("Error getting mentor", exception);
            throw new SkillMentorException("Failed to get mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CacheEvict(value = "mentors", allEntries = true)
    public Mentor updateMentorById(Long id, Mentor updatedMentor, String requestingClerkId, boolean isAdmin) {
        try {
            Mentor mentor = mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND)
            );

            if (!isAdmin && !mentor.getMentorId().equals(requestingClerkId)) {
                log.warn("User {} attempted to update mentor profile {} without permission", requestingClerkId, mentor.getMentorId());
                throw new SkillMentorException("You do not have permission to update this mentor's profile", HttpStatus.FORBIDDEN);
            }

            modelMapper.map(updatedMentor, mentor);
            return mentorRepository.save(mentor);
        } catch (SkillMentorException skillMentorException) {
            log.warn("Mentor not found with id: {} to update", id, skillMentorException);
            throw new SkillMentorException("Mentor Not found", HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            log.error("Error updating mentor", exception);
            throw new SkillMentorException("Failed to update mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public void deleteMentor(Long id) {
        try {
            mentorRepository.deleteById(id);
        } catch (Exception exception) {
            log.error("Failed to delete mentor with id {}", id, exception);
            throw new SkillMentorException("Failed to delete mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

}
