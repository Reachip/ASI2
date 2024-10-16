package fr.cpe.scoobygang.common.activemq;

import java.io.Serializable;

public interface JsonConvertable extends Serializable {
    String toJson();
}
