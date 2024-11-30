package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service;

import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransaction;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.publisher.OrchestratorPublisher;
import fr.cpe.scoobygang.common.activemq.model.*;
import fr.cpe.scoobygang.common.repository.ActiveMQTransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardGenerationService {
    private static final Logger logger = LoggerFactory.getLogger(CardGenerationService.class);

    @Autowired
    private ActiveMQTransactionRepository activeMQTransactionRepository;

    @Autowired
    private OrchestratorPublisher orchestratorPublisher;

    private ActiveMQTransaction createCard(String promptImage, String promptText, String userId) {
        ActiveMQTransaction activeMQTransaction = activeMQTransactionRepository.save(ActiveMQTransaction.build());
        activeMQTransaction.setUserId(userId);

        activeMQTransactionRepository.save(activeMQTransaction);

        logger.info("[Service] Creating card with uuid: {}, promptImage: {}, promptText: {}", activeMQTransaction.getUuid(), promptImage, promptText);

        ImageDemandActiveMQ imageDemandActiveMQ = new ImageDemandActiveMQ( activeMQTransaction.getUuid(), promptImage);
        orchestratorPublisher.sendToImageMS(imageDemandActiveMQ);

        TextDemandActiveMQ textDemandActiveMQ = new TextDemandActiveMQ(activeMQTransaction.getUuid(), promptText);
        orchestratorPublisher.sendToTextMS(textDemandActiveMQ);

        logger.info("[Service] Card creation requests published for uuid: {}",  activeMQTransaction.getUuid());

        return activeMQTransaction;
    }

//    public ActiveMQTransaction createCard(CardDemandRequest cardDemand) {
//        return createCard(cardDemand.getPromptImage(), cardDemand.getPromptText());
//    }

    public ActiveMQTransaction createCard(CardDemandActiveMQ cardDemandActiveMQ) {
        return createCard(cardDemandActiveMQ.getPromptImage(), cardDemandActiveMQ.getPromptText(), cardDemandActiveMQ.getUserId());
    }

    public void postText(GenerationMessage<ContentText> message) {
        String uuid = message.getUuid();
        logger.info("[Service] Posting text for uuid: {}", uuid);

        ContentText contentText = message.getContent();

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        // Vérification que la transaction existe bien
        if (activeMQTransactionOptional.isEmpty()) {
            logger.warn("No transaction found for uuid: {}", uuid);
            return;
        }

        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        // Ajout du texte à la transaction
        activeMQTransaction.setPrompt(contentText.getPrompt());

        // Mise à jour de la transaction en base
        activeMQTransactionRepository.save(activeMQTransaction);
        logger.info("[Service] Text prompt updated for uuid: {}", uuid);

        // Check si l'image n'est pas vide
        if (activeMQTransaction.getImageURL() != null) {
            // Si l'image n'est pas vide -> Générer les properties
            PropertyDemandActiveMQ propertyDemandActiveMQ = new PropertyDemandActiveMQ(uuid, activeMQTransaction.getImageURL());
            orchestratorPublisher.sendToPropertyMS(propertyDemandActiveMQ);
            logger.info("[Service] Property demand published for uuid: {}", uuid);
        }
    }

    public void postImage(GenerationMessage<ContentImage> message) {
        String uuid = message.getUuid();
        logger.info("[Service] Posting image for uuid: {}", uuid);

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        // Vérification que la transaction existe bien
        if (activeMQTransactionOptional.isEmpty()) {
            logger.warn("No transaction found for uuid: {}", uuid);
            return;
        }

        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        // Ajout de l'image à la transaction
        String urlImage = message.getContent().getUrl();
        activeMQTransaction.setImageURL(urlImage);

        // Mise à jour de la transaction en base
        activeMQTransactionRepository.save(activeMQTransaction);
        logger.info("[Service]  Image URL updated for uuid: {}", uuid);

        // Check si l'image n'est pas vide
        if (activeMQTransaction.getPrompt() != null) {
            // Si l'image n'est pas vide -> Générer les properties
            PropertyDemandActiveMQ propertyDemandActiveMQ = new PropertyDemandActiveMQ(uuid, activeMQTransaction.getImageURL());
            orchestratorPublisher.sendToPropertyMS(propertyDemandActiveMQ);
            logger.info("[Service] Property demand published for uuid: {}", uuid);
        }

    }

    public void postProperty(GenerationMessage<CardProperties> message) {
        String uuid = message.getUuid();
        logger.info("Posting properties for uuid: {}", uuid);

        CardProperties cardProperties = message.getContent();

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        if (activeMQTransactionOptional.isEmpty()) {
            logger.warn("No transaction found for uuid: {}", uuid);
            return;
        }

        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        activeMQTransaction.setHp(cardProperties.getHp());
        activeMQTransaction.setAttack(cardProperties.getAttack());
        activeMQTransaction.setDefense(cardProperties.getDefense());
        activeMQTransaction.setEnergy(cardProperties.getEnergy());

        activeMQTransactionRepository.save(activeMQTransaction);
        logger.info("Card properties updated for uuid: {}", uuid);

        orchestratorPublisher.sendToNotify(activeMQTransaction);
        logger.info("Notification sent for card creation for uuid: {}", uuid);
    }
}
