package fr.cpe.scoobygang.common.activemq;

import jakarta.jms.JMSException;
import jakarta.jms.TextMessage;

import java.io.IOException;

public interface Receiver {
    void receive(TextMessage received) throws JMSException, ClassNotFoundException, IOException;
}