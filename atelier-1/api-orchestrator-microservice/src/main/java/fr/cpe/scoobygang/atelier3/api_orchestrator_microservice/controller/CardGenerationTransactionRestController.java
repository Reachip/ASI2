package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/card/transaction")
public class CardGenerationTransactionRestController {
    @PostMapping("/image")
    public ResponseEntity<Object> postImage() {

        return ResponseEntity.ok().build();
    }

    @PostMapping("/prompt")
    public ResponseEntity<Object> postPrompt() {
        return ResponseEntity.ok().build();
    }
}
