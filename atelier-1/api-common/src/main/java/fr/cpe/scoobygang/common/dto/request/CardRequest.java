package fr.cpe.scoobygang.common.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardRequest {
    private int id;
    private String name;
    private String description;
    private String family;
    private String affinity;
    private String imgUrl;
    private int energy;
    private int hp;
    private int defense;
    private int attack;
    private int price;
    private int userId;
    private int storeId;
}
