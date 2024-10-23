package fr.cpe.scoobygang.common.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "activemq_transaction")
@Getter
@Setter
@NoArgsConstructor
public class ActiveMQTransaction {
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

    public ActiveMQTransaction(String uuid) {
        this.uuid = uuid;
    }

    public static ActiveMQTransaction build() {
        return new ActiveMQTransaction(UUID.randomUUID().toString());
    }
}
