package fr.cpe.scoobygang.common.repository;

import fr.cpe.scoobygang.common.model.ActiveMQTransaction;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ActiveMQTransactionRepository extends CrudRepository<ActiveMQTransaction, Integer>  {
    Optional<ActiveMQTransaction> findByUuid(String uuid);
}
