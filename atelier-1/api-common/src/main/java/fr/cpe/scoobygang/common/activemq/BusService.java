package fr.cpe.scoobygang.common.activemq;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jms.core.JmsTemplate;


@Service
public class BusService {
    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendMessage(JsonConvertable jsonConvertable, String busName) {
        System.out.println("[BUSSERVICE] SEND String MSG=["+ jsonConvertable +"] to Bus=["+busName+"]");

        jmsTemplate.send(busName, s -> {
            try {
                TextMessage msg = s.createTextMessage(jsonConvertable.toJson());

                msg.setStringProperty("Content-Type", "application/json");
                msg.setStringProperty("ObjectType", jsonConvertable.getClass().getCanonicalName());

                return msg;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

}
