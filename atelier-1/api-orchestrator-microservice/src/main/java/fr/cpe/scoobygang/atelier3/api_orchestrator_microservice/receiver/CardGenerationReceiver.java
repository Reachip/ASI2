package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service.CardGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.CardDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CardGenerationReceiver implements Receiver {
    @Autowired
    private CardGenerationService cardGenerationService;

    @Autowired
    private TextMessageParser parser;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_CARD, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        final CardDemandActiveMQ cardDemandActiveMQ = parser.toObject(received);

        cardGenerationService.createCard(cardDemandActiveMQ.getUuid(),cardDemandActiveMQ.getPromptImage(), cardDemandActiveMQ.getPromptText());
    }
}