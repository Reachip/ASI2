package fr.cpe.scoobygang.atelier3.api_backend.receiver;

import fr.cpe.scoobygang.atelier3.api_backend.game.dto.GameTransactionDTO;
import fr.cpe.scoobygang.atelier3.api_backend.game.entity.Game;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class GameTransactionReceiver implements Receiver {
    private static final Logger logger = LoggerFactory.getLogger(GameTransactionReceiver.class);

    private final TextMessageParser parser;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public GameTransactionReceiver(GameRepository gameRepository, TextMessageParser parser, UserRepository userRepository) {
        this.parser = parser;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    @Override
    @Transactional
    @JmsListener(destination = QueuesConstants.QUEUE_GAME_TRANSACTION, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        try {
            GameTransactionDTO gameTransaction = parser.toObject(received);

            logger.info("Received game transaction: {}", gameTransaction);

            Game game = gameRepository.findById(gameTransaction.getGameId())
                    .orElseThrow(() -> new IllegalArgumentException("Game not found"));

            game.setIsFinished();

            int winnerId = gameTransaction.getMoneyOperation1() < 0 ? gameTransaction.getUser1Id() : gameTransaction.getUser2Id();

            Optional<UserModel> optionalUserModel =  userRepository.findById(winnerId);
            if (optionalUserModel.isEmpty() ) new IllegalArgumentException("User not found with ID: " + winnerId);

            game.setWinner(optionalUserModel.get());

            UserModel user1 = userRepository.findById(gameTransaction.getUser1Id())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gameTransaction.getUser1Id()));

            UserModel user2 = userRepository.findById(gameTransaction.getUser2Id())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + gameTransaction.getUser2Id()));

            user1.setAccount(user1.getAccount() + gameTransaction.getMoneyOperation1());
            user2.setAccount(user2.getAccount() + gameTransaction.getMoneyOperation2());

            userRepository.saveAll(List.of(user1, user2));
            gameRepository.save(game);

            logger.info("Updated account for user1Id: {} and user2Id: {}", gameTransaction.getUser1Id(), gameTransaction.getUser2Id());
        } catch (Exception why) {
            logger.error("Error processing game transaction: ", why);
            throw why;
        }

    }
}
