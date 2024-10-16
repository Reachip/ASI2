package fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.repository;

import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.CardGenerationTransaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CardGenerationTransactionRepository extends CrudRepository<CardGenerationTransaction, Integer> {
    Optional<CardGenerationTransaction> findByUuid(String uuid);
    Optional<CardGenerationTransaction> findByImageURL(String url);
    Optional<CardGenerationTransaction> findByPrompt(String prompt);
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM CardGenerationTransaction e WHERE e.prompt IS NOT NULL")
    boolean thereIsPrompt();
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM CardGenerationTransaction e WHERE e.imageURL IS NOT NULL")
    boolean thereIsImageURL();
}
