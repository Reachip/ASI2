package fr.cpe.scoobygang.atelier3.api_backend.user.model;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class UserCardsDTO {
    private Integer id;
    private String email;
    private Set<CardDTO> cardList = new HashSet<>();

    public UserCardsDTO(UserModel user) {
        this.id = user.getId();
        this.email = user.getEmail();

        for (CardModel card : user.getCardList()) {
            this.cardList.add(new CardDTO(card));
        }
    }
}
