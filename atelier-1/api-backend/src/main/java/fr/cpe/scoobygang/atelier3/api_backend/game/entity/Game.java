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
    @JoinColumn(name = "winner_user_id")
    private UserModel winner;

    private boolean finished;

    public void setIsFinished() {
        this.finished = true;
    }
}
