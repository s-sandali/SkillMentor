package com.stemlink.skillmentor.configs;

import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.dto.response.SubjectResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Subject;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.typeMap(Mentor.class, MentorResponseDTO.class);
        modelMapper.typeMap(Subject.class, SubjectResponseDTO.class);
        return modelMapper;
    }
}
