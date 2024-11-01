package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.service;

import fr.cpe.scoobygang.common.dto.request.TextRequest;
import fr.cpe.scoobygang.common.dto.request.TextResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class TextGenerationService {

    @Value("${api.text.url}")
    private String apiUrl;

    @Value("${api.text.model}")
    private String modelName;

    private final WebClient webClient;

    public TextGenerationService() {
        this.webClient = WebClient.builder().build();
        initializeModel();
    }

    private void initializeModel() {
        TextRequest request = new TextRequest(modelName, null, false);

        webClient.post()
                .uri(apiUrl + "/api/pull")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe();
    }

    public Mono<String> generateText(String promptTxt) {
        TextRequest request = new TextRequest(modelName, promptTxt, false);

        return webClient.post()
                .uri(apiUrl + "/api/generate")
                .body(Mono.just(request), TextRequest.class)
                .retrieve()
                .bodyToMono(TextResponse.class)
                .map(response -> apiUrl + response.getText());
    }
}