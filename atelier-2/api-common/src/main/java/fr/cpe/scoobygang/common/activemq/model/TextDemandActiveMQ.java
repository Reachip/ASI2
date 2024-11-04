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
public class TextDemandActiveMQ implements Serializable {
    private String uuid;
    private String prompt;

    @Override
    public String toString() {
        return "TextDemandActiveMQ{" +
                "uuid='" + uuid + '\'' +
                ", prompt='" + prompt + '\'' +
                '}';
    }
}
