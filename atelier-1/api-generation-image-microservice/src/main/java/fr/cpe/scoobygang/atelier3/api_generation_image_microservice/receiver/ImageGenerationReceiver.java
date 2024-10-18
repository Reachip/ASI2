package fr.cpe.scoobygang.atelier3.api_generation_image_microservice.receiver;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_generation_image_microservice.service.ImageGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.Content;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class ImageGenerationReceiver implements Receiver {
    @Autowired
    private ImageGenerationService imageGenerationService;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, JsonProcessingException {
        final String clazz = received.getStringProperty("ObjectType");
        final ImageDemandActiveMQ imageDemandActiveMQ = (ImageDemandActiveMQ) objectMapper.readValue(received.getText(), Class.forName(clazz));

        final String url = imageGenerationService.generateImage(imageDemandActiveMQ.getUuid(), imageDemandActiveMQ.getPrompt()).block();
        orchestratorClient.postImage(new GenerationMessage<>(imageDemandActiveMQ.getUuid(), new ContentImage(url))).block();
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_IMAGE, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) throws JMSException, ClassNotFoundException, JsonProcessingException {
        receive(message);
    }
}