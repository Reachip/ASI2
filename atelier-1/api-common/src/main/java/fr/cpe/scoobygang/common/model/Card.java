package fr.cpe.scoobygang.common.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.JSONException;
import org.json.JSONObject;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "storeId", referencedColumnName = "id")
    private Store store;

    public static Card toCard(JSONObject jsonObject) throws JSONException {
        Card card = new Card();

        card.setName(jsonObject.getString("name"));
        card.setDescription(jsonObject.getString("description"));
        card.setFamily(jsonObject.getString("family"));
        card.setAffinity(jsonObject.getString("affinity"));
        card.setImgUrl(jsonObject.getString("imgUrl"));
        card.setEnergy(jsonObject.getInt("energy"));
        card.setHp(jsonObject.getDouble("hp"));
        card.setDefense(jsonObject.getDouble("defense"));
        card.setAttack(jsonObject.getDouble("attack"));
        card.setPrice(jsonObject.getDouble("price"));

        return card;
    }
}
