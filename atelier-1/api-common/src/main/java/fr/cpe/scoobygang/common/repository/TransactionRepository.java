package fr.cpe.scoobygang.common.repository;

import fr.cpe.scoobygang.common.model.Transaction;
import fr.cpe.scoobygang.common.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TransactionRepository extends CrudRepository<Transaction, Integer> {
    @Query("SELECT count(c) FROM Transaction c")
    long count();

    List<Transaction> findByOwner(User user);
}
