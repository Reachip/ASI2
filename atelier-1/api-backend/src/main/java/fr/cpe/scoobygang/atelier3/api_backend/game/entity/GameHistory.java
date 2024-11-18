package fr.cpe.scoobygang.atelier3.api_backend.game.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameHistory implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private int emitterId;

    private int receiverId;

    private int roomId;

    private String message;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;
}
