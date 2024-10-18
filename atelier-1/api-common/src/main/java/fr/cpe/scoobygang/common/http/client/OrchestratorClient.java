package fr.cpe.scoobygang.common.http.client;

import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OrchestratorClient {
    @Value("${api.orchestrator.url}")
    private String apiUrl;

    public Mono<Void> postImage(GenerationMessage generationMessage) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        return webClient.post()
                .uri("/card/transaction/image")
                .body(Mono.just(generationMessage), GenerationMessage.class)
                .retrieve()
                .bodyToMono(Void.class);
    }

    public Mono<Void> postPrompt(GenerationMessage generationMessage) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        return webClient.post()
                .uri("/card/transaction/prompt")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(generationMessage))
                .retrieve()
                .bodyToMono(Void.class);
    }

    public Mono<Void> postProperty(GenerationMessage generationMessage) {
        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        return webClient.post()
                .uri("/property")
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(generationMessage))
                .retrieve()
                .bodyToMono(Void.class);
    }
}
