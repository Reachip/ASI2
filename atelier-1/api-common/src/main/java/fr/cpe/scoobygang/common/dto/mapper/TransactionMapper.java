package fr.cpe.scoobygang.common.dto.mapper;

import fr.cpe.scoobygang.common.dto.response.*;
import fr.cpe.scoobygang.common.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper( TransactionMapper.class );

    @Mapping(source = "owner", target = "ownerId", qualifiedByName = "ownerToOwnerId")
    @Mapping(source = "store", target = "storeId", qualifiedByName = "storeToStoreId")
    @Mapping(source = "card", target = "cardId", qualifiedByName = "cardToCardId")
    TransactionResponse transactionToTransactionResponse(Transaction transaction);
    List<TransactionResponse> transactionsToTransactionResponses(List<Transaction> transactions);
    List<Transaction> transactionResponsesToTransactions(List<TransactionResponse> transactionResponses);

    @Named("ownerToOwnerId")
    static int ownerToOwnerId(User user) {
        return user.getId();
    }

    @Named("cardToCardId")
    static int cardToCardId(Card card) {
        return card.getId();
    }
}
