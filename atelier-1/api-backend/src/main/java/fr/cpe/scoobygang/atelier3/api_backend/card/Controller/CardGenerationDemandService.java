package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import fr.cpe.scoobygang.atelier3.api_backend.publisher.BackendPublisher;
import fr.cpe.scoobygang.common.activemq.model.CardDemandActiveMQ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CardGenerationDemandService
{
    @Autowired
    private BackendPublisher backendPublisher;
    public void sendGenerationCardDemand(String promptImage, String promptText, String userId)
    {
        CardDemandActiveMQ cardDemandActiveMQ = new CardDemandActiveMQ(userId, promptImage, promptText);
        backendPublisher.sendToOrchestrator(cardDemandActiveMQ);
    }
}
