package fr.cpe.scoobygang.common.dto.mapper;

import fr.cpe.scoobygang.common.dto.request.CardRequest;
import fr.cpe.scoobygang.common.dto.response.*;
import fr.cpe.scoobygang.common.model.*;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CardMapper {
    CardMapper INSTANCE = Mappers.getMapper( CardMapper.class );
    void updateCard(@MappingTarget Card card, CardRequest cardRequest);
    Card cardRequestToCard(CardRequest car);

    CardRequest cardToCardRequest(Card card);

    @Mapping(source = "owner", target = "userId", qualifiedByName = "ownerToUserId")
    @Mapping(source = "store", target = "storeId", qualifiedByName = "storeToStoreId")
    CardResponse cardToCardResponse(Card card);

    List<CardResponse> cardsToCardResponses(List<Card> cards);

    Card cardReponseToCard(CardResponse cardResponse);


    @Named("ownerToUserId")
    public static int ownerToUserId(User owner) {
        if (owner == null) {
            return 0;
        }
        return owner.getId();
    }

    @Named("storeToStoreId")
    public static int storeToStoreId(Store store) {
        if (store == null) {
            return 0;
        }
        return store.getId();
    }
}
