package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.repository;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.ActiveMQTransaction;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ActiveMQTransactionRepository extends CrudRepository<ActiveMQTransaction, Long>  {
    Optional<ActiveMQTransaction> findByUuid(String uuid);
}
