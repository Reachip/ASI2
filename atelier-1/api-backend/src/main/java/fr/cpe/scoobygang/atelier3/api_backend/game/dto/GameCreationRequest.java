package fr.cpe.scoobygang.atelier3.api_backend.game.dto;

import lombok.Data;

import java.util.Set;

@Data
public class GameCreationRequest {
    private Integer user1Id;
    private Integer user2Id;
}
