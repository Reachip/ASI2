package fr.cpe.scoobygang.atelier3.api_generation_text_microservice.receiver;

import fr.cpe.scoobygang.atelier3.api_generation_text_microservice.TextGenerationMessage;
import fr.cpe.scoobygang.common.activemq.Receiver;
import jakarta.jms.TextMessage;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class TextGenerationReceiver implements Receiver<TextGenerationMessage> {
    @Override
    public void receive(TextMessage received) {

        // TO-DO
    }

    @JmsListener(destination = "/queue/generation/text", containerFactory = "queueConnectionFactory")
    public void receiveMessageResult(TextMessage message) {
        receive(message);
    }


}