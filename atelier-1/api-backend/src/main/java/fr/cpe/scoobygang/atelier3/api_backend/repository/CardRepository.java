package fr.cpe.scoobygang.atelier3.api_backend.repository;

import fr.cpe.scoobygang.atelier3.api_backend.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}
