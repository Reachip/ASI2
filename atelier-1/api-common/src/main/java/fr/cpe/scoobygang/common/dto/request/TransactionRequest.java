package fr.cpe.scoobygang.common.dto.request;

import fr.cpe.scoobygang.common.model.TransactionAction;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequest {
    private int userId;
    private int cardId;
    private int storeId;
    private TransactionAction action;
}
