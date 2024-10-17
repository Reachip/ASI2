package fr.cpe.scoobygang.common.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
    private Long id;

    private String uuid;


    public ActiveMQTransaction(String uuid) {
        this.uuid = uuid;
    }

    public static ActiveMQTransaction build() {
        return new ActiveMQTransaction(UUID.randomUUID().toString());
    }
}
