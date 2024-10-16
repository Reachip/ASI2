package fr.cpe.scoobygang.common.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardResponse {
    private int id;
    private String name;
    private String description;
    private String family;
    private String affinity;
    private String imgUrl;
    private int energy;
    private double hp;
    private double defense;
    private double attack;
    private double price;
    private int userId;
    private int storeId;

}
