package fr.cpe.scoobygang.atelier3.api_generation_image_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_image_microservice.service.ImageGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ImageGenerationReceiver implements Receiver {
    private static final Logger logger = LoggerFactory.getLogger(ImageGenerationReceiver.class);

    @Autowired
    private ImageGenerationService imageGenerationService;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Autowired
    private TextMessageParser parser;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_IMAGE, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        logger.info("Received message on queue: {}", QueuesConstants.QUEUE_GENERATION_IMAGE);
        final ImageDemandActiveMQ imageDemandActiveMQ = parser.toObject(received);
        logger.info("Parsed image demand: {}", imageDemandActiveMQ);

        final String url = imageGenerationService.generateImage(imageDemandActiveMQ.getUuid(), imageDemandActiveMQ.getPrompt()).block();
        logger.info("Generated image URL: {}", url);

        orchestratorClient.postImage(new GenerationMessage<>(imageDemandActiveMQ.getUuid(), new ContentImage(url))).block();
        logger.info("Image posted successfully for uuid: {}", imageDemandActiveMQ.getUuid());
    }
}
