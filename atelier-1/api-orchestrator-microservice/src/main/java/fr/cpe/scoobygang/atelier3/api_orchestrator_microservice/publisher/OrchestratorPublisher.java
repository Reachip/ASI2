package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.publisher;

import fr.cpe.scoobygang.common.activemq.BusService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class OrchestratorPublisher {
    @Autowired
    BusService busService;

    public void sendToImageMS(Serializable jsonConvertable) {
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_IMAGE);
    }
    public void sendToTextMS(Serializable jsonConvertable) {
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_TEXT);
    }
    public void sendToPropertyMS(Serializable jsonConvertable) {
        busService.send(jsonConvertable, QueuesConstants.QUEUE_GENERATION_PROPERTY);
    }

    public void sendToNotify(Serializable jsonConvertable) {
        busService.send(jsonConvertable, QueuesConstants.QUEUE_NOTIFY);
    }


}
