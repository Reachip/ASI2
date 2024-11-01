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
                .attack(colorToProperties.get("ATTACK"))
                .defense(colorToProperties.get("DEFENSE"))
                .energy(colorToProperties.get("ENERGY"))
                .hp(colorToProperties.get("HP"))
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
