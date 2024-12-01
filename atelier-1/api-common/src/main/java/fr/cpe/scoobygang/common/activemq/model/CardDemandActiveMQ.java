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
    private String userId;
    private String cardName;
    private String promptImage;
    private String promptText;

    @Override
    public String toString() {
        return "CardDemandActiveMQ{" +
                ", userId='" + userId + '\'' +
                ", userId='" + cardName + '\'' +
                ", promptImage='" + promptImage + '\'' +
                ", promptText='" + promptText + '\'' +
                '}';
    }
}