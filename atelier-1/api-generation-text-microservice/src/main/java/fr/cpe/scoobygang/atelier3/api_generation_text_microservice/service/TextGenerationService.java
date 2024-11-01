package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.service;

import fr.cpe.scoobygang.atelier3.api_generation_text_microservice.model.OllamaPromptResult;
import fr.cpe.scoobygang.common.dto.request.TextRequest;
import fr.cpe.scoobygang.common.dto.request.TextResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
@Service
public class TextGenerationService {
    private static final Logger logger = LoggerFactory.getLogger(TextGenerationService.class);

    @Value("${api.text.url}")
    private String apiUrl;

    @Value("${api.text.model}")
    private String modelName;

    private final WebClient webClient;

    public TextGenerationService() {
        this.webClient = WebClient.builder().build();
    }

    private void initializeModel() {
        logger.info("Initializing text generation model: {}", modelName);
        TextRequest request = new TextRequest(modelName, null, false);

        webClient.post()
                .uri(apiUrl + "/api/pull")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe();
        logger.info("Text generation model initialized successfully");
    }

    public Mono<String> generateText(String promptTxt) {
        logger.info("Generating text with prompt: {}", promptTxt);
        initializeModel();

        TextRequest request = new TextRequest(modelName, promptTxt, false);

        return webClient.post()
                .uri(apiUrl + "/api/generate")
                .body(Mono.just(request), TextRequest.class)
                .retrieve()
                .bodyToMono(OllamaPromptResult.class)
                .map(response -> {
                    logger.info("Generated text: {}", response.getResponse());
                    return response.getResponse();
                });
    }
}