package fr.cpe.scoobygang.common.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Transaction
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "cardId", referencedColumnName = "id")
    private Card card;

    @ManyToOne
    @JoinColumn(name = "storeId", referencedColumnName = "id")
    private Store store;

    private TransactionAction action;

    private Timestamp timestamp;

    private double amount;
}
