package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service.CardGenerationService;
import fr.cpe.scoobygang.common.activemq.model.CardProperties;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.ContentText;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/card/transaction")
public class CardGenerationTransactionRestController {
    @Autowired
    private CardGenerationService cardGenerationService;

    @PostMapping("/image")
    public ResponseEntity<Object> postImage(@RequestBody GenerationMessage<ContentImage> generationMessage) {
        cardGenerationService.postImage(generationMessage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/prompt")
    public ResponseEntity<Object> postPrompt(@RequestBody GenerationMessage<ContentText> generationMessage) {
        cardGenerationService.postText(generationMessage);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/property")
    public ResponseEntity<Object> postProperty(@RequestBody GenerationMessage<CardProperties> generationMessage) {
        cardGenerationService.postProperty(generationMessage);
        return ResponseEntity.ok().build();
    }
}
