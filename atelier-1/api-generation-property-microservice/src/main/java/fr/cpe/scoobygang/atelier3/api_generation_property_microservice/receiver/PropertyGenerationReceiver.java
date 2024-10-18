package fr.cpe.scoobygang.atelier3.api_generation_property_microservice.receiver;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service.PropertyGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.*;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class PropertyGenerationReceiver implements Receiver {
    @Autowired
    private PropertyGenerationService propertyGenerationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Override
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, JsonProcessingException {
        final String clazz = received.getStringProperty("ObjectType");
        final PropertyDemandActiveMQ propertyDemandActiveMQ = (PropertyDemandActiveMQ) objectMapper.readValue(received.getText(), Class.forName(clazz));

        final CardProperties properties = propertyGenerationService.createProperty(propertyDemandActiveMQ.getUrl());
        orchestratorClient.postProperty(propertyDemandActiveMQ.getUuid(), properties).block();
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_PROPERTY, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) throws JMSException, ClassNotFoundException, JsonProcessingException {
        receive(message);
    }
}