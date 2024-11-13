package fr.cpe.scoobygang.atelier3.api_backend.receiver;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelService;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.handler.WebSocketHandler;
import fr.cpe.scoobygang.atelier3.api_backend.mapper.CardModelMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserService;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransaction;
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
    CardModelService cardModelService;

    @Autowired
    private WebSocketHandler webSocketHandler;

    @Autowired
    private UserService userService;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_NOTIFY, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        logger.info("Received message on queue: {}", QueuesConstants.QUEUE_NOTIFY);

        ActiveMQTransaction activeMQTransaction = parser.toObject(received);
        logger.info("Parsed activeMQTransaction demand: {}", activeMQTransaction);

        final CardModel cardModel = CardModelMapper.INSTANCE.activeMQTransactionToCard(activeMQTransaction);
        cardModel.setUser(userService.getUser(activeMQTransaction.getUserId()).get());

        cardModelService.addCard(cardModel);
        logger.info("Add Card");

        // Debit user :
        UserModel user = cardModel.getUser();
        user.setAccount(user.getAccount() - 100);
        userService.updateUser(user);

        logger.info("Update user account");

        logger.info("Card creation process terminate");

        webSocketHandler.broadcastMessage(cardModel);
    }
}
