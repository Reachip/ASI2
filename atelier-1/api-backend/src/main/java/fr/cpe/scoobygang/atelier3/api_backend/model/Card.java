package fr.cpe.scoobygang.atelier3.api_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "card")
public class Card implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageURL;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    private float defense;

    private float energy;

    private float hp;

    private float attack;
}
