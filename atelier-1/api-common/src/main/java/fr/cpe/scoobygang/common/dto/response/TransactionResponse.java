package fr.cpe.scoobygang.common.dto.response;

import fr.cpe.scoobygang.common.model.TransactionAction;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class TransactionResponse {
    private int ownerId;
    private int storeId;
    private int cardId;
    private TransactionAction action;
    private Timestamp timestamp;
    private double amount;
}
