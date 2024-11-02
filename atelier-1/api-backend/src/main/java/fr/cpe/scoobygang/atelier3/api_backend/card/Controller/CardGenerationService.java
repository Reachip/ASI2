package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.dto.request.CardDemandRequest;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.dto.response.CardCreationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class CardGenerationService {
    private String apiUrl = "http://localhost:8080/orchestrator/card/transaction/create";

    public Mono<String> sendGenerationCardDemand(String promptImage, String promptText)
    {
        final Logger logger = LoggerFactory.getLogger(CardGenerationService.class);

        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        final CardDemandRequest request = new CardDemandRequest(promptImage, promptText);

        return webClient.post()
                .body(Mono.just(request), CardDemandRequest.class)
                .retrieve()
                .bodyToMono(CardCreationResponse.class)
                .map(response -> {
                    String uuid = response.getUuid();
                    logger.info("Generated card : {}", uuid);
                    return uuid;
                });
    }
}
