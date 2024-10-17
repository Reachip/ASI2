package fr.cpe.scoobygang.atelier3.api_generation_image_microservice.service;


import fr.cpe.scoobygang.common.dto.request.ImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ImageGenerationService {

    private final WebClient webClient;

    @Value("${api.image.url}")
    private String apiUrl;

    public ImageGenerationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public Mono<String> generateImage(String promptTxt, String negativePromptTxt) {
        ImageRequest request = new ImageRequest(promptTxt, negativePromptTxt);

        WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .build();

        return webClient.post()
                .uri("/fake/prompt/req")
                .body(Mono.just(request), ImageRequest.class)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> apiUrl + "/imgs/default-2.jpg");
    }
}
