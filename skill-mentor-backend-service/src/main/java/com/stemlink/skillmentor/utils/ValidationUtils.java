package com.stemlink.skillmentor.utils;

import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.exceptions.BookingConflictException;

import java.util.Collections;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class ValidationUtils {

    /**
     * Validates if the mentor is available during the requested session time
     * @param mentor The mentor entity
     * @param sessionAt The session start time
     * @param durationMinutes The session duration in minutes
     * @throws IllegalArgumentException if mentor is not available
     */
    public static void validateMentorAvailability(Mentor mentor, Date sessionAt, Integer durationMinutes) {
        if (durationMinutes == null || durationMinutes <= 0) {
            durationMinutes = 60; // default duration
        }

        Date sessionEnd = addMinutesToDate(sessionAt, durationMinutes);
        List<Session> mentorSessions = mentor.getSessions() != null ? mentor.getSessions() : Collections.emptyList();

        for (Session existingSession : mentorSessions) {
            if (!isBlockingSession(existingSession)) {
                continue;
            }

            Date existingStart = existingSession.getSessionAt();
            Date existingEnd = addMinutesToDate(existingStart, existingSession.getDurationMinutes());

            // Check for time overlap
            if (isTimeOverlap(sessionAt, sessionEnd, existingStart, existingEnd)) {
                throw new BookingConflictException("Mentor is not available at the requested time");
            }
        }
    }

    /**
     * Validates if the student is available during the requested session time
     * @param student The student entity
     * @param sessionAt The session start time
     * @param durationMinutes The session duration in minutes
     * @throws IllegalArgumentException if student is not available
     */
    public static void validateStudentAvailability(Student student, Date sessionAt, Integer durationMinutes) {
        if (durationMinutes == null || durationMinutes <= 0) {
            durationMinutes = 60; // default duration
        }

        Date sessionEnd = addMinutesToDate(sessionAt, durationMinutes);
        List<Session> studentSessions = student.getSessions() != null ? student.getSessions() : Collections.emptyList();

        for (Session existingSession : studentSessions) {
            if (!isBlockingSession(existingSession)) {
                continue;
            }

            Date existingStart = existingSession.getSessionAt();
            Date existingEnd = addMinutesToDate(existingStart, existingSession.getDurationMinutes());

            // Check for time overlap
            if (isTimeOverlap(sessionAt, sessionEnd, existingStart, existingEnd)) {
                throw new BookingConflictException("Student already has an overlapping session at the requested time");
            }
        }
    }

    public static void validateSessionTimeInFuture(Date sessionAt) {
        if (sessionAt == null) {
            throw new BookingConflictException("Session date/time is required");
        }

        if (!sessionAt.after(new Date())) {
            throw new BookingConflictException("Session time must be in the future");
        }
    }

    public static void validateSubjectBelongsToMentor(Subject subject, Mentor mentor) {
        if (subject == null || mentor == null || subject.getMentor() == null || subject.getMentor().getId() == null
                || mentor.getId() == null || !subject.getMentor().getId().equals(mentor.getId())) {
            throw new BookingConflictException("Selected subject does not belong to the selected mentor");
        }
    }

    /**
     * Checks if two time periods overlap
     */
    public static boolean isTimeOverlap(Date start1, Date end1, Date start2, Date end2) {
        return start1.before(end2) && start2.before(end1);
    }

    /**
     * Adds minutes to a given date
     */
    public static Date addMinutesToDate(Date date, int minutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minutes);
        return calendar.getTime();
    }

    private static boolean isBlockingSession(Session session) {
        if (session == null || session.getSessionAt() == null) {
            return false;
        }

        SessionStatus status = session.getSessionStatus();
        return status == null || (status != SessionStatus.CANCELLED && status != SessionStatus.COMPLETED);
    }
}
