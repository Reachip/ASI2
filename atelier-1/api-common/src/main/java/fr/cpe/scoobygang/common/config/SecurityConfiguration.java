package fr.cpe.scoobygang.common.config;

import fr.cpe.scoobygang.common.filter.AuthorizationFilter;
import fr.cpe.scoobygang.common.jwt.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration {
    @Autowired
    private JWTService jwtService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.addFilterBefore(new AuthorizationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
