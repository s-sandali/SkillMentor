package com.stemlink.skillmentor.security;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.net.URL;
import java.security.PublicKey;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import static com.stemlink.skillmentor.constants.UserRoles.ROLE_STUDENT;

@Slf4j
public class ClerkValidator implements TokenValidator {

    private final JwkProvider jwkProvider;

    public ClerkValidator(@Value("${clerk.jwks.url}") String clerkJwksUrl) {
        try {
            this.jwkProvider = new UrlJwkProvider(new URL(clerkJwksUrl));
        } catch (Exception e) {
            log.error("Failed to initialize JwkProvider with URL: {}", clerkJwksUrl, e);
            throw new RuntimeException("Failed to initialize Clerk validator", e);
        }
    }

    @Override
    public boolean validateToken(String token) {
        try {
            // Step 1: Decode JWT without verification to get header info
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT == null) {
                log.error("Failed to decode token");
                return false;
            }

            // Step 2: Extract key ID (kid) from the token header
            String kid = decodedJWT.getKeyId();
            if (kid == null || kid.isEmpty()) {
                log.error("Token does not contain a key ID (kid)");
                return false;
            }

            log.debug("Token kid: {}", kid);

            // Step 3: Fetch JWK and verify signature
            if (!verifyTokenSignature(token, kid)) {
                log.error("Token signature verification failed");
                return false;
            }

            log.debug("Token validation successful for subject: {}", decodedJWT.getSubject());
            return true;

        } catch (Exception e) {
            log.error("Error validating token: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String extractUserId(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            return decodedJWT != null ? decodedJWT.getSubject() : null;
        } catch (Exception e) {
            log.error("Error extracting user ID: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<String> extractRoles(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT == null) {
                return null;
            }

            // 1) roles claim as array
            if (decodedJWT.getClaim("roles") != null && !decodedJWT.getClaim("roles").isNull()) {
                List<String> roles = decodedJWT.getClaim("roles").asList(String.class);
                if (roles != null && !roles.isEmpty()) {
                    List<String> normalizedRoles = normalizeRoles(roles);
                    if (!normalizedRoles.isEmpty()) {
                        return normalizedRoles;
                    }
                }

                // 2) roles claim as single string
                String singleRole = decodedJWT.getClaim("roles").asString();
                if (singleRole != null && !singleRole.isBlank()) {
                    return Collections.singletonList(singleRole.trim().toUpperCase(Locale.ROOT));
                }
            }

            // 3) direct role claim
            if (decodedJWT.getClaim("role") != null && !decodedJWT.getClaim("role").isNull()) {
                String directRole = decodedJWT.getClaim("role").asString();
                if (directRole != null && !directRole.isBlank()) {
                    return Collections.singletonList(directRole.trim().toUpperCase(Locale.ROOT));
                }
            }

            // 4) public_metadata.role fallback
            if (decodedJWT.getClaim("public_metadata") != null && !decodedJWT.getClaim("public_metadata").isNull()) {
                Map<String, Object> publicMetadata = decodedJWT.getClaim("public_metadata").asMap();
                if (publicMetadata != null && publicMetadata.containsKey("role")) {
                    Object roleObj = publicMetadata.get("role");
                    if (roleObj instanceof String) {
                        String normalizedRole = ((String) roleObj).trim();
                        if (!normalizedRole.isBlank()) {
                            return Collections.singletonList(normalizedRole.toUpperCase(Locale.ROOT));
                        }
                    } else if (roleObj instanceof List<?>) {
                        List<String> normalizedRoles = ((List<?>) roleObj).stream()
                                .map(Object::toString)
                                .map(String::trim)
                                .filter(role -> !role.isBlank())
                                .map(role -> role.toUpperCase(Locale.ROOT))
                                .collect(Collectors.toList());
                        if (!normalizedRoles.isEmpty()) {
                            return normalizedRoles;
                        }
                    }
                }
            }

            log.debug("No explicit Clerk role found for subject {}; defaulting to {}", decodedJWT.getSubject(), ROLE_STUDENT);
            return Collections.singletonList(ROLE_STUDENT);
        } catch (Exception e) {
            log.error("Error extracting roles: {}", e.getMessage());
            return null;
        }
    }

    private List<String> normalizeRoles(List<String> roles) {
        return roles.stream()
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .map(role -> role.toUpperCase(Locale.ROOT))
                .collect(Collectors.toList());
    }

    @Override
    public String extractFirstName(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            return decodedJWT != null ? decodedJWT.getClaim("first_name").asString() : null;
        } catch (Exception e) {
            log.error("Error extracting first name: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String extractLastName(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            return decodedJWT != null ? decodedJWT.getClaim("last_name").asString() : null;
        } catch (Exception e) {
            log.error("Error extracting last name: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String extractEmail(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            return decodedJWT != null ? decodedJWT.getClaim("email").asString() : null;
        } catch (Exception e) {
            log.error("Error extracting email: {}", e.getMessage());
            return null;
        }
    }

    private DecodedJWT decodeToken(String token) {
        try {
            return JWT.decode(token);
        } catch (Exception e) {
            log.error("Failed to decode token: {}", e.getMessage());
            return null;
        }
    }

    private boolean verifyTokenSignature(String token, String kid) {
        try {
            // Fetch the JWK from Clerk
            Jwk jwk = jwkProvider.get(kid);

            // Get the public key from the JWK
            PublicKey publicKey = jwk.getPublicKey();

            // Create algorithm and verify the token (allowing 60 seconds of clock skew)
            Algorithm algorithm = Algorithm.RSA256((java.security.interfaces.RSAPublicKey) publicKey, null);
            JWT.require(algorithm)
                    .acceptLeeway(60) // allow 60s of clock skew for nbf/exp claims
                    .build()
                    .verify(token);

            log.debug("Token signature verified successfully for kid: {}", kid);
            return true;

        } catch (Exception e) {
            log.error("Signature verification failed for kid {}: {}", kid, e.getMessage());
            return false;
        }
    }

}
