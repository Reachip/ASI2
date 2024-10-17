package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service.CardGenerationService;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/card/transaction")
public class CardGenerationTransactionRestController {
    @Autowired
    private CardGenerationService cardGenerationService;

    @PostMapping("/image")
    public ResponseEntity<Object> postImage(@RequestBody GenerationMessage generationMessage) {
        cardGenerationService.postImage(generationMessage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/prompt")
    public ResponseEntity<Object> postPrompt(@RequestBody GenerationMessage generationMessage) {
        cardGenerationService.postText(generationMessage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/property")
    public ResponseEntity<Object> postProperty(@RequestBody GenerationMessage generationMessage) {
        cardGenerationService.postProperty(generationMessage);
        return ResponseEntity.ok().build();
    }
}
