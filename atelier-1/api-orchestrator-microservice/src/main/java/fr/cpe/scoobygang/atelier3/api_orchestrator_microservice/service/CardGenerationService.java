package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.repository.CardGenerationTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CardGenerationService {
    @Autowired
    private CardGenerationTransactionRepository cardGenerationTransactionRepository;

    public void postImage(fr.cpe.scoobygang.common.activemq.model.Image image) {
        if (cardGenerationTransactionRepository.findByUuid(image.getTransactionUUID()).isEmpty()) {
            return;
        }

        if (cardGenerationTransactionRepository.thereIsPrompt()) {
            // Ne pas générer les properties
        }

        else {
            // Générer les properties
        }

    }

    public void postText(Object text) {
        if (cardGenerationTransactionRepository.thereIsImageURL()) {
            // Ne pas générer les properties
        }

        else {
            // Générer les properties
        }
    }
}
