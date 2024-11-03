package fr.cpe.scoobygang.atelier3.api_backend.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.io.Serializable;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public final class WebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper mapper;

    public WebSocketHandler() {
        this.mapper = new ObjectMapper();
    }

    @Override
    public void afterConnectionEstablished(final WebSocketSession session) {
        logger.info("Connexion établie");
        sessions.add(session);
        logger.info("Nombre de sessions : " + sessions.size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Connexion fermée");
        sessions.remove(session);
        logger.info("Nombre de sessions : " + sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        logger.info("Récéption d'un message : " + message.getPayload());
    }

    public void broadcastMessage(final Serializable message) throws IOException {
        final String messageAsString = mapper.writeValueAsString(new CardDTO((CardModel) message));
        logger.info("Broadcast message : " + messageAsString + "to " + sessions.size() + " clients");

        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage(messageAsString));
        }
    }
}