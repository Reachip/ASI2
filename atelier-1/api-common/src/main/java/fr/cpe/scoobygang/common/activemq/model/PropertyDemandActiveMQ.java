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
public class PropertyDemandActiveMQ implements Serializable {
    private String uuid;
    private String url;

    @Override
    public String toString() {
        return "PropertyDemandActiveMQ{" +
                "uuid='" + uuid + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
}
