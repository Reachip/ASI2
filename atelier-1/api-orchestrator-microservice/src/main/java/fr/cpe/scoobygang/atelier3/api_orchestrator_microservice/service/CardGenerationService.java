package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.service;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.publisher.OrchestratorPublisher;
import fr.cpe.scoobygang.common.activemq.model.*;
import fr.cpe.scoobygang.common.model.ActiveMQTransaction;
import fr.cpe.scoobygang.common.repository.ActiveMQTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CardGenerationService {
    @Autowired
    private ActiveMQTransactionRepository activeMQTransactionRepository;

    @Autowired
    private OrchestratorPublisher orchestratorPublisher;

    public void createCard(String uuid, String promptImage, String promptText){
        // Publication des demandes de création
        ImageDemandActiveMQ imageDemandActiveMQ = new ImageDemandActiveMQ(uuid,promptImage);
        orchestratorPublisher.sendToImageMS(imageDemandActiveMQ);

        TextDemandActiveMQ textDemandActiveMQ = new TextDemandActiveMQ(uuid,promptText);
        orchestratorPublisher.sendToTextMS(textDemandActiveMQ);
    }


    public void postImage(GenerationMessage<ContentImage> message) {
        String uuid = message.getUuid();

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        // Vérification que la transaction existe bien
        if (activeMQTransactionOptional.isEmpty())
            return;

        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        // Ajout de l'image à la transaction
        String urlImage = message.getContent().getUrl();
        activeMQTransaction.setImageURL(urlImage);

        // Mise à jour de la transaction en base
        activeMQTransactionRepository.save(activeMQTransaction);

        // Check si le texte n'est pas vide
        if (activeMQTransaction.getPrompt()!=null) {
            // Si le text n'est pas vide -> Générer les properties
            PropertyDemandActiveMQ propertyDemandActiveMQ = new PropertyDemandActiveMQ(uuid,urlImage);
            orchestratorPublisher.sendToPropertyMS(propertyDemandActiveMQ);
        }
    }

    public void postText(GenerationMessage<ContentText> message) {
        String uuid = message.getUuid();

        ContentText contentText = message.getContent();

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        // Vérification que la transaction existe bien
        if (activeMQTransactionOptional.isEmpty()) return;
        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        // Ajout du texte à la transaction
        activeMQTransaction.setPrompt(contentText.getPrompt());

        // Mise à jour de la transaction en base
        activeMQTransactionRepository.save(activeMQTransaction);

        // Check si l'image n'est pas vide
        if (activeMQTransaction.getImageURL() != null) {
            // Si l'image n'est pas vide -> Générer les properties
            PropertyDemandActiveMQ propertyDemandActiveMQ = new PropertyDemandActiveMQ(uuid, activeMQTransaction.getImageURL());
            orchestratorPublisher.sendToPropertyMS(propertyDemandActiveMQ);
        }
    }

    public void postProperty(GenerationMessage<CardProperties> message) {
        String uuid = message.getUuid();
        CardProperties cardProperties = message.getContent();

        Optional<ActiveMQTransaction> activeMQTransactionOptional = activeMQTransactionRepository.findByUuid(uuid);

        // Vérification que la transaction existe bien
        if (activeMQTransactionOptional.isEmpty()) return;
        ActiveMQTransaction activeMQTransaction = activeMQTransactionOptional.get();

        // Ajout des properties à la transaction
        activeMQTransaction.setHp(cardProperties.getHp());
        activeMQTransaction.setAttack(cardProperties.getAttack());
        activeMQTransaction.setDefense(cardProperties.getDefense());
        activeMQTransaction.setEnergy(cardProperties.getEnergy());

        // Mise à jour de la transaction en base
        activeMQTransactionRepository.save(activeMQTransaction);

        // Informe l'app que la carte à été créée
        orchestratorPublisher.sendToNotify(new NotifyDemandActiveMQ(uuid));
    }
}
