package fr.cpe.scoobygang.atelier3.api_backend;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelRepository;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.card.service.RandomCardService;
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

    public ApiBackendMonolithicApplication(UserRepository userRepository, CardModelRepository cardRepository, RandomCardService randomCardService, RandomUserService randomUserService) {
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
            userRepository.deleteAll();
            cardRepository.deleteAll();

            userRepository.saveAll(randomUserService.getAllUsers());

            userRepository.findAll().forEach(user -> {
                HashSet<CardModel> cards = new HashSet<>();

                for (int i = 0; i < 10; i++) {
                    CardModel card = randomCardService.generateRandomCard();
                    card.setUser(user);

                    cards.add(card);
                }

                user.setCardList(cards);
                userRepository.save(user);
            });
        };
    }
}
