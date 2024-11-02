package fr.cpe.scoobygang.atelier3.api_backend.mapper;

import fr.cpe.scoobygang.atelier3.api_backend.model.Card;
import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransactionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CardMapper {
    CardMapper INSTANCE = Mappers.getMapper(CardMapper.class);
    Card activeMQTransactionToCard(ActiveMQTransactionDTO car);
}
