package fr.cpe.scoobygang.atelier3.api_backend.game.repository;

import fr.cpe.scoobygang.atelier3.api_backend.game.entity.GameHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameHistoryRepository extends JpaRepository<GameHistory, Long> {
    List<GameHistory> findByGameId(Long gameId);
    List<GameHistory> findByEmitterId(Long emitterId);
    List<GameHistory> findByReceiverId(Long emitterId);

    List<GameHistory> findByGameIdAndEmitterId(Long gameId, Long emitterId);
    List<GameHistory> findByReceiverIdAndGameId(Long emitterId, Long gameId);
}
