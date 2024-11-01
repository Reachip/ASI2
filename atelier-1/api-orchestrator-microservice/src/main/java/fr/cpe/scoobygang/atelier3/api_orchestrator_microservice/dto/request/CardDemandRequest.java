package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CardDemandRequest {
    private String promptImage;
    private String promptText;
}
