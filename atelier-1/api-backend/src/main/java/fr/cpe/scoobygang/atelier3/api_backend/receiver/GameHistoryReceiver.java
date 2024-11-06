package fr.cpe.scoobygang.atelier3.api_backend.receiver;

import fr.cpe.scoobygang.atelier3.api_backend.game.entity.GameHistory;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameHistoryRepository;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GameHistoryReceiver implements Receiver {
    private static final Logger logger = LoggerFactory.getLogger(GameHistoryReceiver.class);

    @Autowired
    private TextMessageParser parser;

    @Autowired
    private GameHistoryRepository gameHistoryRepository;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GAME_HISTORY, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        logger.info("Received game history: {}", received);
        GameHistory save = gameHistoryRepository.save(parser.toObject(received));
        logger.info("Saved game history: {}", save);
    }
}
