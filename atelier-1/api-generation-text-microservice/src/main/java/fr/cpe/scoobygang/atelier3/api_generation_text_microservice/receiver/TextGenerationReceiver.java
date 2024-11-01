package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_text_microservice.service.TextGenerationService;
import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import fr.cpe.scoobygang.common.activemq.model.ContentImage;
import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.model.ImageDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.model.TextDemandActiveMQ;
import fr.cpe.scoobygang.common.activemq.parse.TextMessageParser;
import fr.cpe.scoobygang.common.http.client.OrchestratorClient;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class TextGenerationReceiver implements Receiver {
    @Autowired
    private TextGenerationService textGenerationService;

    @Autowired
    private OrchestratorClient orchestratorClient;

    @Autowired
    private TextMessageParser parser;

    @Override
    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_TEXT, containerFactory = "queueConnectionFactory")
    public void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException {
        final TextDemandActiveMQ textDemandActiveMQ = parser.toObject(received);
        final String text = textGenerationService.generateText(textDemandActiveMQ.getPrompt()).block();

        orchestratorClient.postPrompt(new GenerationMessage<>(textDemandActiveMQ.getUuid(), text)).block();
    }
}