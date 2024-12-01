package fr.cpe.scoobygang.common.activemq.model;

import lombok.*;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CardProperties extends Content {
    private float defense;
    private float energy;
    private float hp;
    private float attack;

    public static CardProperties from(Map<String, Float> colorToProperties) {
        return CardProperties.builder()
                .attack(Math.round(colorToProperties.get("ATTACK")))
                .defense(Math.round(colorToProperties.get("DEFENSE")))
                .energy(Math.round(colorToProperties.get("ENERGY")))
                .hp(Math.round(colorToProperties.get("HP")))
                .build();
    }

    @Override
    public String toString() {
        return "CardProperties{" +
                "defense=" + defense +
                ", energy=" + energy +
                ", hp=" + hp +
                ", attack=" + attack +
                '}';
    }
}
