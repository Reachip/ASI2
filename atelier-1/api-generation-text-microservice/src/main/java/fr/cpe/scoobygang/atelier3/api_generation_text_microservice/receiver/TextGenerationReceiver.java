package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.receiver;

import fr.cpe.scoobygang.common.activemq.QueuesConstants;
import fr.cpe.scoobygang.common.activemq.Receiver;
import jakarta.jms.TextMessage;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class TextGenerationReceiver implements Receiver {
    @Override
    public void receive(TextMessage received) {
        System.out.println(received.toString());
    }

    @JmsListener(destination = QueuesConstants.QUEUE_GENERATION_TEXT, containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }

}