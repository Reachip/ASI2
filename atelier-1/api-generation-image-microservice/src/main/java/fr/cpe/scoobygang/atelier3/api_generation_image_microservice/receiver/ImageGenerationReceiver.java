package fr.cpe.scoobygang.atelier3.api_generation_image_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_image_microservice.service.ImageGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class ImageGenerationReceiver implements Receiver<GenerationMessage> {
    @Autowired
    private ImageGenerationService imageGenerationService;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Override
    public void receive(TextMessage received) {
        final String uuid = "123e4567-e89b-12d3-a456-426614174000";
        final ImageDemandActiveMQ imageDemandActiveMQ = new ImageDemandActiveMQ(uuid, "a beautiful cat on a plane");

        final String url = imageGenerationService.generateImage(imageDemandActiveMQ.getUuid(), imageDemandActiveMQ.getPrompt()).block();

        orchestratorClient.postImage(new GenerationMessage(uuid, new ContentImage(url)));
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_IMAGE, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }
}