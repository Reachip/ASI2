package fr.cpe.scoobygang.atelier3.api_backend.game;

import fr.cpe.scoobygang.atelier3.api_backend.game.entity.GameHistory;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/game")
public class GameRestController {
    private final GameHistoryRepository gameHistoryRepository;

    public GameRestController(GameHistoryRepository gameHistoryRepository) {
        this.gameHistoryRepository = gameHistoryRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<List<GameHistory>> getGameHistory(
            @RequestParam(required = false) Long receiverId,
            @RequestParam(required = false) Long emitterId,
            @RequestParam(required = false) Long roomId) {

        List<GameHistory> gameHistoryList;

        if (receiverId != null && emitterId != null && roomId != null) {
            gameHistoryList = gameHistoryRepository.findByReceiverIdAndGameId(receiverId, roomId);
        } else if (receiverId != null && emitterId != null) {
            gameHistoryList = gameHistoryRepository.findByReceiverIdAndGameId(receiverId, emitterId);
        } else if (receiverId != null) {
            gameHistoryList = gameHistoryRepository.findByReceiverId(receiverId);
        } else if (emitterId != null) {
            gameHistoryList = gameHistoryRepository.findByEmitterId(emitterId);
        } else if (roomId != null) {
            gameHistoryList = gameHistoryRepository.findByGameId(roomId);
        } else {
            gameHistoryList = gameHistoryRepository.findAll();
        }

        return ResponseEntity.ok(gameHistoryList);
    }
}
