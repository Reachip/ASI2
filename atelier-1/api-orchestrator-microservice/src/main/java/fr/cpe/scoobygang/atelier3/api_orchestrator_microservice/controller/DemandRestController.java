package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.controller;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/demand")
public class DemandRestController {
    @Autowired
    private BusService busService;

    @PostMapping("/image")
    public ResponseEntity<Void> imageDemand() {
        busService.sendMessage(new ImageDemandActiveMQ(UUID.randomUUID().toString(), "A beautiful cat"), QueuesConstants.QUEUE_GENERATION_IMAGE);
        return ResponseEntity.ok().build();
    }
}
