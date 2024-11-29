package fr.cpe.scoobygang.atelier3.api_backend;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelRepository;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.card.service.RandomCardService;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import fr.cpe.scoobygang.atelier3.api_backend.user.service.RandomUserService;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jms.annotation.EnableJms;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@EnableJms
@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
        "fr.cpe.scoobygang.atelier3.api_backend",
        "fr.cpe.scoobygang.common.*",
})
@OpenAPIDefinition(info = @Info(title = "Card Market Rest Api", version = "1.0", description = "Information about the Card Market APi and how to interact with"))
// doc here localhost:8088/swagger-ui.html
public class ApiBackendMonolithicApplication {
    private final UserRepository userRepository;
    private final CardModelRepository cardRepository;
    private final RandomCardService randomCardService;
    private final RandomUserService randomUserService;
    private final GameRepository gameRepository;

    public ApiBackendMonolithicApplication(GameRepository gameRepository, UserRepository userRepository, CardModelRepository cardRepository, RandomCardService randomCardService, RandomUserService randomUserService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.randomCardService = randomCardService;
        this.randomUserService = randomUserService;
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiBackendMonolithicApplication.class, args);
    }

    @Bean
    @Transactional
    public CommandLineRunner run() {
        return args -> {
            gameRepository.deleteAll();
            userRepository.deleteAll();
            cardRepository.deleteAll();

            List<UserModel> users = randomUserService.getAllUsers();
            userRepository.saveAll(users);

            Set<String> usedCardNames = new HashSet<>();

            userRepository.findAll().forEach(user -> {
                HashSet<CardModel> uniqueCards = new HashSet<>();

                for (int i = 0; i < 10; i++) {
                    CardModel card;

                    do {
                        card = randomCardService.generateRandomCard();
                    } while (usedCardNames.contains(card.getName()));

                    card.setUser(user);
                    uniqueCards.add(card);
                    usedCardNames.add(card.getName());
                }

                user.setCardList(uniqueCards);
                userRepository.save(user);
            });
        };
    }
}
