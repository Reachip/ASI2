package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.mapper;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.ActiveMQTransaction;
import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransactionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ActiveMQTransactionMapper {
    ActiveMQTransactionMapper INSTANCE = Mappers.getMapper( ActiveMQTransactionMapper.class );
    ActiveMQTransactionDTO ActiveMQTransactionToActiveMQTransactionDTO(ActiveMQTransaction activeMQTransaction);
}
