package fr.cpe.scoobygang.common.repository;

import fr.cpe.scoobygang.common.activemq.model.ActiveMQTransaction;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ActiveMQTransactionRepository extends CrudRepository<ActiveMQTransaction, Long>  {
    Optional<ActiveMQTransaction> findByUuid(String uuid);
}
