package com.stemlink.skillmentor.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidSessionTimeException extends SkillMentorException {

    public InvalidSessionTimeException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
