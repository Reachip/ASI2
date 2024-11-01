package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.publisher;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class OrchestratorPublisher {
    private static final Logger logger = LoggerFactory.getLogger(OrchestratorPublisher.class);

    @Autowired
    private BusService busService;

    public void sendToImageMS(Serializable jsonConvertable) {
        logger.info("Sending message to image MS: {}", jsonConvertable);
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_IMAGE);
        logger.info("Message sent to image MS successfully");
    }

    public void sendToTextMS(Serializable jsonConvertable) {
        logger.info("Sending message to text MS: {}", jsonConvertable);
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_TEXT);
        logger.info("Message sent to text MS successfully");
    }

    public void sendToPropertyMS(Serializable jsonConvertable) {
        logger.info("Sending message to property MS: {}", jsonConvertable);
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_PROPERTY);
        logger.info("Message sent to property MS successfully");
    }

    public void sendToNotify(Serializable jsonConvertable) {
        logger.info("Sending notification message: {}", jsonConvertable);
        busService.send(jsonConvertable, QueuesConstants.QUEUE_NOTIFY);
        logger.info("Notification message sent successfully");
    }
}
