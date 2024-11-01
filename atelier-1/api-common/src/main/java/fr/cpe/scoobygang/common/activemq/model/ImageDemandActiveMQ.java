package fr.cpe.scoobygang.common.activemq.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImageDemandActiveMQ implements Serializable {
    private String uuid;
    private String prompt;

    @Override
    public String toString() {
        return "ImageDemandActiveMQ{" +
                "uuid='" + uuid + '\'' +
                ", prompt='" + prompt + '\'' +
                '}';
    }
}