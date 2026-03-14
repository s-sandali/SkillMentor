package com.stemlink.skillmentor.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ClerkValidatorTest {

    private final ClerkValidator clerkValidator = new ClerkValidator("https://example.com/.well-known/jwks.json");

    @Test
    void extractRoles_DefaultsToStudent_WhenTokenHasNoRoleClaims() {
        String token = JWT.create()
                .withSubject("user_123")
                .withClaim("email", "student@example.com")
                .sign(Algorithm.HMAC256("test-secret"));

        List<String> roles = clerkValidator.extractRoles(token);

        assertEquals(List.of("STUDENT"), roles);
    }

    @Test
    void extractRoles_UsesPublicMetadataRole_WhenPresent() {
        String token = JWT.create()
                .withSubject("user_456")
                .withClaim("public_metadata", Map.of("role", "mentor"))
                .sign(Algorithm.HMAC256("test-secret"));

        List<String> roles = clerkValidator.extractRoles(token);

        assertEquals(List.of("MENTOR"), roles);
    }
}
