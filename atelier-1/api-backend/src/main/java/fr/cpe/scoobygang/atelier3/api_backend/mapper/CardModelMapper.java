package fr.cpe.scoobygang.atelier3.api_backend.mapper;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.ActiveMQTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CardModelMapper {
    CardModelMapper INSTANCE = Mappers.getMapper(CardModelMapper.class);
    CardModel activeMQTransactionToCard(ActiveMQTransaction car);
}
