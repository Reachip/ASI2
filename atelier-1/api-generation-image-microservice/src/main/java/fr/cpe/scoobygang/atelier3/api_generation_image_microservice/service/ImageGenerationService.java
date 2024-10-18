package fr.cpe.scoobygang.atelier3.api_generation_image_microservice.service;


import fr.cpe.scoobygang.common.dto.request.ImageRequest;
import fr.cpe.scoobygang.common.dto.request.ImageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ImageGenerationService {
    @Value("${api.image.url}")
    private String apiUrl;

    @Value("${api.image.fake:true}")
    private boolean imageFakeGeneration;

    public Mono<String> generateImage(String promptTxt, String negativePromptTxt) {
        final ImageRequest request = new ImageRequest(promptTxt, negativePromptTxt);

        final WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        return webClient.post()
                .uri(imageFakeGeneration ? "/fake/prompt/req" : "/prompt/req")
                .body(Mono.just(request), ImageRequest.class)
                .retrieve()
                .bodyToMono(ImageResponse.class)
                .map(response -> apiUrl + response.getUrl());
    }
}
