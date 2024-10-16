package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model;

import fr.cpe.scoobygang.common.activemq.model.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "card_generation_transaction")
public class CardGenerationTransaction {
    @Id
    private Long id;

    private String uuid;

    private String imageURL;

    private String prompt;

    public CardGenerationTransaction(String uuid) {
        this.uuid = uuid;
    }
}
