package fr.cpe.scoobygang.common.activemq.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "activemq_transaction")
@Getter
@Setter
@NoArgsConstructor
public class ActiveMQTransaction implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid;

    private String name;

    private String userId;

    private String imgUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private float defence = 0;

    private float energy = 0;

    private float hp = 0;

    private float attack = 0;

    public ActiveMQTransaction(String uuid) {
        this.uuid = uuid;
    }

    public static ActiveMQTransaction build() {
        return new ActiveMQTransaction(UUID.randomUUID().toString());
    }

    @Override
    public String toString() {
        return "ActiveMQTransaction{" +
                "id=" + id +
                ", uuid='" + uuid + '\'' +
                ", userId='" + userId + '\'' +
                ", name='" + name + '\'' +
                ", imageURL='" + imgUrl + '\'' +
                ", prompt='" + description + '\'' +
                ", defense=" + defence +
                ", energy=" + energy +
                ", hp=" + hp +
                ", attack=" + attack +
                '}';
    }
}
