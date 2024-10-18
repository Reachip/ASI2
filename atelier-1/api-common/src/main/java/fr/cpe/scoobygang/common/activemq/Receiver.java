package fr.cpe.scoobygang.common.activemq;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;

public interface Receiver {
    void receive(TextMessage received) throws JMSException, ClassNotFoundException, JsonProcessingException;
}