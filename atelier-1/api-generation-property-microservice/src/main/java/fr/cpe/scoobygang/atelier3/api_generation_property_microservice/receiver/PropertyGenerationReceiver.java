package fr.cpe.scoobygang.atelier3.api_generation_property_microservice.receiver;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service.PropertyGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.model.PropertyDemandActiveMQ;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class PropertyGenerationReceiver implements Receiver<GenerationMessage> {
    @Autowired
    private PropertyGenerationService propertyGenerationService;

    @Autowired
    private ObjectMapper objectMapper;


    @Override
    public void receive(TextMessage received) {
        try {
            final String clazz = received.getStringProperty("ObjectType");
            final PropertyDemandActiveMQ propertyDemandActiveMQ = (PropertyDemandActiveMQ) objectMapper.readValue(received.getText(), Class.forName(clazz));

            propertyGenerationService.createProperty(propertyDemandActiveMQ.getUrl());
        } catch (Exception ignored) {
        }
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_PROPERTY, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }
}