package fr.cpe.scoobygang.atelier3.api_backend.game.repository;

import fr.cpe.scoobygang.atelier3.api_backend.game.entity.GameHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameHistory, Long> { }
