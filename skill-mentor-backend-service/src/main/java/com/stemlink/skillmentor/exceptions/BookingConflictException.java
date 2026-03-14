package com.stemlink.skillmentor.exceptions;

import org.springframework.http.HttpStatus;

public class BookingConflictException extends SkillMentorException {

    public BookingConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
