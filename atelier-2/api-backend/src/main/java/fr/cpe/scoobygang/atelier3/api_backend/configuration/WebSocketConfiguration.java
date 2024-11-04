package fr.cpe.scoobygang.atelier3.api_backend.configuration;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfiguration.class);
    private final WebSocketHandler webSocketHandler;

    @Value("${ws.endpoints:/ws}")
    private String emergencyEndpoint;

    @Value("ws://127.0.0.1:${server.port}")
    private String serverAddress;

    public WebSocketConfiguration(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(final WebSocketHandlerRegistry registry) {
        logger.info("WS is running at " + serverAddress + emergencyEndpoint);
        registry.addHandler(webSocketHandler, emergencyEndpoint).setAllowedOrigins("*");
    }
}