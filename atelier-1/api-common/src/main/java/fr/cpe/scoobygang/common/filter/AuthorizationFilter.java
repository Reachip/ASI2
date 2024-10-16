package fr.cpe.scoobygang.common.filter;

import fr.cpe.scoobygang.common.filter.utils.WebUtils;
import fr.cpe.scoobygang.common.jwt.JWT;
import fr.cpe.scoobygang.common.jwt.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class AuthorizationFilter extends GenericFilterBean {
    private final JWTService jwtService;

    public AuthorizationFilter(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        Map<String, String> headers = WebUtils.getHeadersInfo((HttpServletRequest)servletRequest);
        String bearer = headers.get(WebUtils.AUTHORIZATION_HEADER_NAME);

        if (bearer != null) {
            Optional<JWT> optionalJWT = jwtService.fromAuthorization(bearer);

            if (optionalJWT.isEmpty()) {
                ((HttpServletResponse) servletResponse).sendError(HttpServletResponse.SC_UNAUTHORIZED, "The token is not valid.");
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
