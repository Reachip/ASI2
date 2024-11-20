package fr.cpe.scoobygang.atelier3.api_backend.receiver;

import fr.cpe.scoobygang.atelier3.api_backend.game.dto.GameTransactionDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
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
import java.util.List;

@Component
public class GameTransactionReceiver implements Receiver {
    private static final Logger logger = LoggerFactory.getLogger(GameTransactionReceiver.class);

    private final TextMessageParser parser;
    private final UserRepository userRepository;

    public GameTransactionReceiver(TextMessageParser parser, UserRepository userRepository) {
        this.parser = parser;
        this.userRepository = userRepository;
    }

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GAME_TRANSACTION, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        GameTransactionDTO gameTransaction = parser.toObject(received);

        logger.info("Received game transaction: {}", gameTransaction);

        UserModel user1 = userRepository.findById(gameTransaction.getUser1Id())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gameTransaction.getUser1Id()));

        UserModel user2 = userRepository.findById(gameTransaction.getUser2Id())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gameTransaction.getUser2Id()));

        user1.setAccount(user1.getAccount() + gameTransaction.getMoneyOperation1());
        user2.setAccount(user2.getAccount() + gameTransaction.getMoneyOperation2());

        userRepository.saveAll(List.of(user1, user2));

        logger.info("Updated account for user1Id: {} and user2Id: {}", gameTransaction.getUser1Id(), gameTransaction.getUser2Id());
    }

}
