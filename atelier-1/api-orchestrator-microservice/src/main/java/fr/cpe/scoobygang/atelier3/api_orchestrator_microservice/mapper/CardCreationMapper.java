package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.mapper;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.dto.response.CardCreationResponse;
import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CardCreationMapper {
    CardCreationMapper INSTANCE = Mappers.getMapper(CardCreationMapper.class);
    CardCreationResponse transactionToCardCreationResponse(ActiveMQTransaction transaction);
}
