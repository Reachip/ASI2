package fr.cpe.scoobygang.atelier3.api_backend.game.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class GameTransactionDTO implements Serializable {
    private int gameId;
    private int user1Id;
    private int user2Id;
    private int moneyOperation1;
    private int moneyOperation2;
}
