package fr.cpe.scoobygang.atelier3.api_backend.handler;


import fr.cpe.scoobygang.common.websocket.WSMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public final class WebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(final WebSocketSession session) {
        logger.info("Connexion établie");

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

    public void broadcastMessage(final WSMessage message) throws IOException {
        // TODO: Appeler cette méthode quand on a la réponse
        //  de l'orchestrateur qui nous signal via requête POST que tout est terminé ...

        //        for (WebSocketSession session : sessions) {
        //                session.sendMessage(new TextMessage("du JSON sous forme de string ..."));
        //        }
    }
}