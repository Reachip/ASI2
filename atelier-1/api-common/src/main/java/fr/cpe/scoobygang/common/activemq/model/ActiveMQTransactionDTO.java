package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class ActiveMQTransactionDTO implements Serializable {
    private String uuid;

    private String imageURL;

    private String prompt;

    private float defense;

    private float energy;

    private float hp;

    private float attack;

    @Override
    public String toString() {
        return "ActiveMQTransaction{" +
                "uuid='" + uuid + '\'' +
                ", imageURL='" + imageURL + '\'' +
                ", prompt='" + prompt + '\'' +
                ", defense=" + defense +
                ", energy=" + energy +
                ", hp=" + hp +
                ", attack=" + attack +
                '}';
    }
}
