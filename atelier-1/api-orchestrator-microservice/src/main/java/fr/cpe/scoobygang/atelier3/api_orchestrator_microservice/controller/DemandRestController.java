package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.model.CardDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.PropertyDemandActiveMQ;
import fr.cpe.scoobygang.common.model.ActiveMQTransaction;
import fr.cpe.scoobygang.common.repository.ActiveMQTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
// test
@RestController
@RequestMapping("/demand")
public class DemandRestController {
    @Autowired
    private BusService busService;
    @Autowired
    private ActiveMQTransactionRepository activeMQTransactionRepository;
    @PostMapping("/card")
    public ResponseEntity<Void> cardDemand() {
        ActiveMQTransaction activeMQTransaction = new ActiveMQTransaction().build();
        activeMQTransactionRepository.save(activeMQTransaction);
        busService.send(new CardDemandActiveMQ(activeMQTransaction.getUuid(), "A beautiful cat","test"), QueuesConstants.QUEUE_GENERATION_CARD);

        return ResponseEntity.ok().build();
    }


    @PostMapping("/image")
    public ResponseEntity<Void> imageDemand() {
        busService.send(new ImageDemandActiveMQ(UUID.randomUUID().toString(), "A beautiful cat"), QueuesConstants.QUEUE_GENERATION_IMAGE);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/properties")
    public ResponseEntity<Void> propertiesDemand() {
        busService.send(new PropertyDemandActiveMQ(UUID.randomUUID().toString(), "http://localhost:8989/imgs/default-2.jpg"), QueuesConstants.QUEUE_GENERATION_PROPERTY);
        return ResponseEntity.ok().build();
    }
}
