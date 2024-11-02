package fr.cpe.scoobygang.atelier3.api_backend.receiver;

import fr.cpe.scoobygang.atelier3.api_backend.handler.WebSocketHandler;
import fr.cpe.scoobygang.atelier3.api_backend.mapper.CardMapper;
import fr.cpe.scoobygang.atelier3.api_backend.model.Card;
import fr.cpe.scoobygang.atelier3.api_backend.repository.CardRepository;
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
public class CardGenerationCompleteReceiver implements Receiver {
    private static final Logger logger = LoggerFactory.getLogger(CardGenerationCompleteReceiver.class);

    @Autowired
    private TextMessageParser parser;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private WebSocketHandler webSocketHandler;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_NOTIFY, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        logger.info("Received message on queue: {}", QueuesConstants.QUEUE_NOTIFY);

        final Card card = CardMapper.INSTANCE.activeMQTransactionToCard(parser.toObject(received));
        cardRepository.save(card);

        logger.info("Parsed card demand: {}", card);
        logger.info("Card creation process initiate");

        webSocketHandler.broadcastMessage(card);
    }
}
