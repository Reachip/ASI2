package fr.cpe.scoobygang.atelier3.api_backend.game.entity;


import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameDeck implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    @ManyToMany
    @JoinTable(
            name = "game_deck_cards",
            joinColumns = @JoinColumn(name = "game_deck_id"),
            inverseJoinColumns = @JoinColumn(name = "card_id")
    )
    private Set<CardModel> selectedCards = new HashSet<>();

    public void addCard(CardModel card) {
        if (card.getUser().equals(this.user)) {
            this.selectedCards.add(card);
        }
    }

    public void removeCard(CardModel card) {
        this.selectedCards.remove(card);
    }
}
