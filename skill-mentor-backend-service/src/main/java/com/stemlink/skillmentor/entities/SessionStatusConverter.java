package com.stemlink.skillmentor.entities;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class SessionStatusConverter implements AttributeConverter<SessionStatus, String> {

    @Override
    public String convertToDatabaseColumn(SessionStatus attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public SessionStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        String normalized = dbData.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);

        return SessionStatus.valueOf(normalized);
    }
}