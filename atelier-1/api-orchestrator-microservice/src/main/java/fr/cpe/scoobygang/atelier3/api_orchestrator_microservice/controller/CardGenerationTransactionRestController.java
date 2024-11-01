package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service.CardGenerationService;
import fr.cpe.scoobygang.common.activemq.model.*;
import fr.cpe.scoobygang.common.dto.request.CardDemandRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/card/transaction")
public class CardGenerationTransactionRestController {
    private static final Logger logger = LoggerFactory.getLogger(CardGenerationTransactionRestController.class);

    @Autowired
    private CardGenerationService cardGenerationService;

    @PostMapping("/create")
    public ResponseEntity<Void> cardDemand(@RequestBody CardDemandRequest cardDemand) {
        if (cardDemand.getPromptImage() == null || cardDemand.getPromptText() == null) {
            logger.error("Validation failed for card demand: {}", cardDemand);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        logger.info("Received card demand : {}", cardDemand);

        cardGenerationService.createCard(cardDemand);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/prompt")
    public ResponseEntity<Object> postPrompt(@RequestBody GenerationMessage<ContentText> generationMessage) {
        logger.info("Received prompt generation message: {}", generationMessage);
        cardGenerationService.postText(generationMessage);
        logger.info("Prompt generation message processed successfully");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/image")
    public ResponseEntity<Object> postImage(@RequestBody GenerationMessage<ContentImage> generationMessage) {
        logger.info("Received image generation message: {}", generationMessage);
        cardGenerationService.postImage(generationMessage);
        logger.info("Image generation message processed successfully");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/property")
    public ResponseEntity<Object> postProperty(@RequestBody GenerationMessage<CardProperties> generationMessage) {
        logger.info("Received property generation message: {}", generationMessage);
        cardGenerationService.postProperty(generationMessage);
        logger.info("Property generation message processed successfully");
        return ResponseEntity.ok().build();
    }
}
