package fr.cpe.scoobygang.common.activemq;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jms.core.JmsTemplate;

import java.io.Serializable;


@Service
public class BusService implements BusSender {
    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void send(Serializable jsonConvertable, String busName) {
        System.out.println("[BUSSERVICE] SEND String MSG=["+ jsonConvertable +"] to Bus=["+busName+"]");

        jmsTemplate.send(busName, s -> {
            try {
                TextMessage msg = s.createTextMessage(objectMapper.writeValueAsString(jsonConvertable));

                msg.setStringProperty("Content-Type", "application/json");
                msg.setStringProperty("ObjectType", jsonConvertable.getClass().getCanonicalName());

                return msg;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

}
