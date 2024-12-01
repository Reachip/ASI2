package fr.cpe.scoobygang.atelier3.api_backend.card.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardDemandDTO {
    String cardName;
    String username;
    String promptImage;
    String promptText;
}
