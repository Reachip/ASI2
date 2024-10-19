package fr.cpe.scoobygang.atelier3.api_generation_property_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service.PropertyGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.*;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PropertyGenerationReceiver implements Receiver {
    @Autowired
    private PropertyGenerationService propertyGenerationService;

    @Autowired
    private TextMessageParser parser;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_PROPERTY, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        final PropertyDemandActiveMQ propertyDemandActiveMQ = parser.toObject(received);
        final CardProperties properties = propertyGenerationService.createProperty(propertyDemandActiveMQ.getUrl());

        orchestratorClient.postProperty(propertyDemandActiveMQ.getUuid(), properties).block();
    }
}