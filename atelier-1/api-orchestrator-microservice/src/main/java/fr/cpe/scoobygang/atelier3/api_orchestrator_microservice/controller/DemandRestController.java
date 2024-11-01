package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.model.CardDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.PropertyDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.TextDemandActiveMQ;
import fr.cpe.scoobygang.common.model.ActiveMQTransaction;
import fr.cpe.scoobygang.common.repository.ActiveMQTransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
// test
@RestController
@RequestMapping("/demand")
@Deprecated
public class DemandRestController {
    private static final Logger logger = LoggerFactory.getLogger(DemandRestController.class);

    @Autowired
    private BusService busService;

    @Autowired
    private ActiveMQTransactionRepository activeMQTransactionRepository;

    @PostMapping("/card")
    @Deprecated
    public ResponseEntity<Void> cardDemand() {
        logger.info("Received card demand request");

        ActiveMQTransaction activeMQTransaction = ActiveMQTransaction.build();
        activeMQTransactionRepository.save(activeMQTransaction);

        busService.send(new CardDemandActiveMQ(activeMQTransaction.getUuid(), "A beautiful cat", "test"), QueuesConstants.QUEUE_GENERATION_CARD);
        logger.info("Card demand sent successfully");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/image")
    @Deprecated
    public ResponseEntity<Void> imageDemand() {
        logger.info("Received image demand request");
        busService.send(new ImageDemandActiveMQ(UUID.randomUUID().toString(), "A beautiful cat"), QueuesConstants.QUEUE_GENERATION_IMAGE);
        logger.info("Image demand sent successfully");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/text")
    @Deprecated
    public ResponseEntity<Void> textDemand() {
        logger.info("Received text demand request");
        busService.send(new TextDemandActiveMQ(UUID.randomUUID().toString(), "Why is the sky blue?"), QueuesConstants.QUEUE_GENERATION_TEXT);
        logger.info("Text demand sent successfully");

        return ResponseEntity.ok().build();
    }

    @PostMapping("/properties")
    @Deprecated
    public ResponseEntity<Void> propertiesDemand() {
        logger.info("Received properties demand request");
        busService.send(new PropertyDemandActiveMQ(UUID.randomUUID().toString(), "http://localhost:8989/imgs/default-2.jpg"), QueuesConstants.QUEUE_GENERATION_PROPERTY);
        logger.info("Properties demand sent successfully");

        return ResponseEntity.ok().build();
    }
}

