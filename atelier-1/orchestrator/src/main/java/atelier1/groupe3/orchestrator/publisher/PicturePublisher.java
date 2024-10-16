package atelier1.groupe3.orchestrator.publisher;

import activemq.Publishable;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class PicturePublisher implements Publishable<com.baeldung.openapi.model.Picture> {
    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendMsg(com.baeldung.openapi.model.Picture picture, String busName) {
        System.out.println("[BUSSERVICE] SEND String MSG=["+picture+"] to Bus=["+busName+"]");

        jmsTemplate.send(busName, s -> {
            try {
                TextMessage msg = s.createTextMessage(objectMapper.writeValueAsString(picture));
                msg.setStringProperty("Content-Type", "application/json");
                msg.setStringProperty("ObjectType", picture.getClass().getCanonicalName());

                return msg;
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Override
    public void publish(com.baeldung.openapi.model.Picture picture) {
        sendMsg(picture, "RESULT_BUS_MNG");
    }
}
