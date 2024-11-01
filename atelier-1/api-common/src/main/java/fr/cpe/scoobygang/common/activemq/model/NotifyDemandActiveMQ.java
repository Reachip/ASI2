package fr.cpe.scoobygang.common.activemq.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotifyDemandActiveMQ implements Serializable{
    private String uuid;

    @Override
    public String toString() {
        return "NotifyDemandActiveMQ{" +
                "uuid='" + uuid + '\'' +
                '}';
    }
}
