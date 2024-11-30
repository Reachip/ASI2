package fr.cpe.scoobygang.atelier3.api_backend.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameTransactionDTO implements Serializable {
    private int gameId;
    private int user1Id;
    private int user2Id;
    private int moneyOperation1;
    private int moneyOperation2;

    @Override
    public String toString() {
        return "GameTransactionDTO{" +
                "gameId='" + gameId + '\'' +
                ", user1Id='" + user1Id + '\'' +
                ", user2Id='" + user2Id + '\'' +
                ", moneyOperation1='" + moneyOperation1 + '\'' +
                ", moneyOperation2='" + moneyOperation2 + '\'' +
                '}';
    }

}
