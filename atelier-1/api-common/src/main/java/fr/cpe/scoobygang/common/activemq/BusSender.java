package fr.cpe.scoobygang.common.activemq;

import java.io.Serializable;

public interface BusSender {
    void send(Serializable jsonConvertable, String busName);
}
