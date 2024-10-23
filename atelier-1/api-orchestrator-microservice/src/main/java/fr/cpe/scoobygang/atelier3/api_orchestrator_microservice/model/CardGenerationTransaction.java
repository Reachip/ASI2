package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid;

    private String imageURL;

    private String prompt;

    private float defense;

    private float energy;

    private float hp;

    private float attack;

    public CardGenerationTransaction(String uuid) {
        this.uuid = uuid;
    }
}
