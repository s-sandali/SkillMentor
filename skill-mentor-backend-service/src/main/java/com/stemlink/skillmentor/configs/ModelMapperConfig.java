package com.stemlink.skillmentor.configs;

import com.stemlink.skillmentor.dto.response.MentorResponseDTO;
import com.stemlink.skillmentor.dto.response.SubjectResponseDTO;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Subject;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.typeMap(Subject.class, SubjectResponseDTO.class);

        modelMapper.typeMap(Mentor.class, MentorResponseDTO.class)
                .setPostConverter(ctx -> {
                    Mentor src = ctx.getSource();
                    MentorResponseDTO dst = ctx.getDestination();
                    dst.setSubjects(src.getSubjects() != null
                            ? src.getSubjects().stream()
                                    .map(s -> modelMapper.map(s, SubjectResponseDTO.class))
                                    .toList()
                            : List.of());
                    return dst;
                });

        return modelMapper;
    }
}
