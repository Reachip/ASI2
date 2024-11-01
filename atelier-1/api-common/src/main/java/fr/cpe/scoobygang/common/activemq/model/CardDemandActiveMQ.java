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
public class CardDemandActiveMQ implements Serializable{
    private String uuid;
    private String promptImage;
    private String promptText;

    @Override
    public String toString() {
        return "CardDemandActiveMQ{" +
                "uuid='" + uuid + '\'' +
                ", promptImage='" + promptImage + '\'' +
                ", promptText='" + promptText + '\'' +
                '}';
    }
}