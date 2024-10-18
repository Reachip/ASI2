package fr.cpe.scoobygang.common.activemq;

import java.io.Serializable;

public interface Publisher<T extends Serializable> {
    void send(T toSend);
}
