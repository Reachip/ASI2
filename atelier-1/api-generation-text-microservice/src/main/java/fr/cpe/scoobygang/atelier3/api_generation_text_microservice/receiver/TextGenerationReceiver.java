package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.receiver;

import fr.cpe.scoobygang.common.activemq.model.GenerationMessage;
import fr.cpe.scoobygang.common.activemq.Receiver;
import jakarta.jms.TextMessage;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class TextGenerationReceiver implements Receiver<GenerationMessage> {
    @Override
    public void receive(TextMessage received) {
        System.out.println(received.toString());
    }

    @JmsListener(destination = "/queue/generation/text", containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }

}