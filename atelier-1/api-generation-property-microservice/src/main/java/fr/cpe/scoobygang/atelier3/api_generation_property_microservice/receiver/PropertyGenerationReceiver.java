package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service.PropertyGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.Receiver;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class PropertyGenerationReceiver implements Receiver<GenerationMessage> {
    @Autowired
    private PropertyGenerationService propertyGenerationService;
    @Override
    public void receive(TextMessage received) {
        System.out.println(received.toString());

        propertyGenerationService.createProperty(message);
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_PROPERTY, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }

}