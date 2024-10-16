package fr.cpe.scoobygang.common.activemq;

import jakarta.jms.TextMessage;

public interface Receiver<T extends JsonConvertable> {
    void receive(TextMessage received);
}