package fr.cpe.scoobygang.atelier3.api_backend.game.entity;

import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Game implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id")
    private UserModel user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private UserModel user2;

    @ManyToOne
    @JoinColumn(name = "game_master_id")
    private UserModel gameMaster;

    @OneToOne(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private GameDeck deck1;

    @OneToOne(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private GameDeck deck2;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GameHistory> gameHistories = new HashSet<>();

    public void initializeDecks() {
        this.deck1 = new GameDeck(this, user1);
        this.deck2 = new GameDeck(this, user2);
    }

    public boolean isValidGameMaster() {
        return gameMaster != null && (gameMaster.equals(user1) || gameMaster.equals(user2));
    }
}
