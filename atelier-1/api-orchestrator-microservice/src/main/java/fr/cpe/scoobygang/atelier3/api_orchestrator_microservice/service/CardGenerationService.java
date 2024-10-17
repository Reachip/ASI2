package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.CardGenerationTransaction;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.repository.CardGenerationTransactionRepository;
import fr.cpe.scoobygang.common.activemq.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardGenerationService {
    @Autowired
    private CardGenerationTransactionRepository cardGenerationTransactionRepository;

    public void postImage(GenerationMessage message) {
        String uidMessage = message.getUuid();

        Image image = (Image) message.getContent();

        Optional<CardGenerationTransaction> cardGenerationTransaction = cardGenerationTransactionRepository.findByUuid(uidMessage);

        // Vérification que la transaction existe bien
        if (cardGenerationTransaction.isEmpty()) return;

        // Ajout de l'image à la transaction
        cardGenerationTransaction.get().setImageURL(image.getUrl());

        // Check si le texte n'est pas vide
        if (!cardGenerationTransaction.get().getPrompt().isEmpty()) {
            // Si le text n'est pas vide -> Générer les properties
        }
    }

    public void postText(GenerationMessage message) {
        String uidMessage = message.getUuid();

        Text text = (Text) message.getContent();

        Optional<CardGenerationTransaction> cardGenerationTransaction = cardGenerationTransactionRepository.findByUuid(uidMessage);

        // Vérification que la transaction existe bien
        if (cardGenerationTransaction.isEmpty()) return;

        // Ajout du texte à la transaction
        cardGenerationTransaction.get().setPrompt(text.getResult());

        // Mise à jour de la transaction en base
        cardGenerationTransactionRepository.save(cardGenerationTransaction.get());

        // Check si l'image n'est pas vide
        if (!cardGenerationTransaction.get().getImageURL().isEmpty()) {
            // Si l'image n'est pas vide -> Générer les properties
        }
    }

    public void postProperty(GenerationMessage message) {
        String uidMessage = message.getUuid();

        Property property = (Property) message.getContent();

        Optional<CardGenerationTransaction> cardGenerationTransaction = cardGenerationTransactionRepository.findByUuid(uidMessage);

        // Vérification que la transaction existe bien
        if (cardGenerationTransaction.isEmpty()) return;

        // Ajout des properties à la transaction
        cardGenerationTransaction.get().setRandPart(property.getRandPart());
        cardGenerationTransaction.get().setNb_of_colors(property.getNb_of_colors());
        cardGenerationTransaction.get().setValueToDispatch(property.getValueToDispatch());

        // Mise à jour de la transaction en base
        cardGenerationTransactionRepository.save(cardGenerationTransaction.get());

            // Si l'image n'est pas vide -> Générer les properties
    }
}