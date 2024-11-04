package fr.cpe.scoobygang.common.activemq.parse;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Serializable;

@Service
public class TextMessageParser {
    private final ObjectMapper objectMapper;

    public TextMessageParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public <T extends Serializable> T toObject(TextMessage received)  throws JMSException, IOException, ClassNotFoundException {
        final String clazz = received.getStringProperty("ObjectType");
        final Class<?> clazzType = Class.forName(clazz);

        if (!Serializable.class.isAssignableFrom(clazzType)) {
            throw new IllegalArgumentException("The class " + clazz + " does not implement Serializable");
        }

        return (T) objectMapper.readValue(received.getText(), clazzType);
    }
}
