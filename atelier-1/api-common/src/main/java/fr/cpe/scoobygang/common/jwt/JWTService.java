package fr.cpe.scoobygang.common.jwt;

import fr.cpe.scoobygang.common.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;


@Service
public class JWTService {
    private static final long EXPIRATION_TIME = 15;

    @Value("${jwt.secret}")
    private String JWT_SECRET;

    public JWT fromUser(User user) throws JSONException {
        final String token = Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME * 1000 * 60))
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();

        return new JWT(token);
    }

    public Optional<JWT> fromAuthorization(String authorizationString) {
        try {
            String token = authorizationString.split(" ")[1];
            return Optional.of(new JWT(token));
        } catch (Exception why) {
            return Optional.empty();
        }
    }
}
