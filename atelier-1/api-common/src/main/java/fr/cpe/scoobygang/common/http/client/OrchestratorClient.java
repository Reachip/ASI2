package fr.cpe.scoobygang.common.http.client;

import fr.cpe.scoobygang.common.activemq.model.CardProperties;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@Service
public class OrchestratorClient {
    private static final Logger logger = LoggerFactory.getLogger(OrchestratorClient.class);

    @Value("${api.orchestrator.url}")
    private String apiUrl;

    public Mono<Void> postImage(GenerationMessage<ContentImage> generationMessage) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        logger.info("Posting image with generation message: {}", generationMessage);

        return webClient.post()
                .uri("/card/transaction/image")
                .body(Mono.just(generationMessage), GenerationMessage.class)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnSuccess(response -> logger.info("Image posted successfully"))
                .doOnError(error -> logger.error("Failed to post image", error));
    }

    public Mono<Void> postPrompt(GenerationMessage<String> generationMessage) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        logger.info("Posting prompt with generation message: {}", generationMessage);

        return webClient.post()
                .uri("/card/transaction/prompt")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(generationMessage))
                .retrieve()
                .bodyToMono(Void.class)
                .doOnSuccess(response -> logger.info("Prompt posted successfully"))
                .doOnError(error -> logger.error("Failed to post prompt", error));
    }

    public Mono<Void> postProperty(String uuid, CardProperties cardProperties) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        logger.info("Posting property with uuid: {} and card properties: {}", uuid, cardProperties);

        return webClient.post()
                .uri("/card/transaction/property")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(new GenerationMessage<>(uuid, cardProperties)))
                .retrieve()
                .bodyToMono(Void.class)
                .doOnSuccess(response -> logger.info("Property posted successfully"))
                .doOnError(error -> logger.error("Failed to post property", error));
    }
}