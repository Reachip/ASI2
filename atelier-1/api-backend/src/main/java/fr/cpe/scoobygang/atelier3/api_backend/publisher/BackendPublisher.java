package fr.cpe.scoobygang.atelier3.api_backend.publisher;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class BackendPublisher {
    private static final Logger logger = LoggerFactory.getLogger(fr.cpe.scoobygang.atelier3.api_backend.publisher.BackendPublisher.class);

    @Autowired
    private BusService busService;

    public void sendToOrchestrator(Serializable jsonConvertable) {
        logger.info("Sending message to image MS: {}", jsonConvertable);
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_CARD);
        logger.info("Message sent to image MS successfully");
    }
}