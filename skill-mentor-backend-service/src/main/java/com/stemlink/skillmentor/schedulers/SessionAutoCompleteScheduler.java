package com.stemlink.skillmentor.schedulers;

import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.SessionStatus;
import com.stemlink.skillmentor.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * Automatically marks sessions as COMPLETED once their end time has passed.
 * Runs every 15 minutes. Only sessions in SCHEDULED or IN_PROGRESS state are affected.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SessionAutoCompleteScheduler {

    private final SessionRepository sessionRepository;

    /** Excluded statuses — sessions already in these states are never touched. */
    private static final List<SessionStatus> EXCLUDED = List.of(
            SessionStatus.COMPLETED,
            SessionStatus.CANCELLED
    );

    @Scheduled(cron = "0 */15 * * * *") // every 15 minutes at :00 seconds
    @Transactional
    public void autoCompleteExpiredSessions() {
        Date now = new Date();

        // Fetch active sessions whose sessionAt is already in the past.
        // We use `now` as the cutoff so we don't pull future sessions into memory.
        List<Session> candidates = sessionRepository.findActiveSessionsStartedBefore(EXCLUDED, now);

        List<Session> toComplete = candidates.stream()
                .filter(s -> isSessionEnded(s, now))
                .toList();

        if (toComplete.isEmpty()) {
            log.debug("SessionAutoCompleteScheduler: no expired sessions found");
            return;
        }

        toComplete.forEach(s -> s.setSessionStatus(SessionStatus.COMPLETED));
        sessionRepository.saveAll(toComplete);
        log.info("SessionAutoCompleteScheduler: marked {} session(s) as COMPLETED", toComplete.size());
    }

    /** Returns true if sessionAt + durationMinutes has already passed. */
    private boolean isSessionEnded(Session session, Date now) {
        if (session.getSessionAt() == null) return false;
        int duration = session.getDurationMinutes() != null ? session.getDurationMinutes() : 60;
        long endTimeMillis = session.getSessionAt().getTime() + (long) duration * 60_000;
        return endTimeMillis < now.getTime();
    }
}
