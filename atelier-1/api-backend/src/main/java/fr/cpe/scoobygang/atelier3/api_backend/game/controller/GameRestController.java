package fr.cpe.scoobygang.atelier3.api_backend.game.controller;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelRepository;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.game.dto.GameCreationRequest;
import fr.cpe.scoobygang.atelier3.api_backend.game.entity.Game;
import fr.cpe.scoobygang.atelier3.api_backend.game.entity.GameHistory;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameHistoryRepository;
import fr.cpe.scoobygang.atelier3.api_backend.game.repository.GameRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserRepository;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/game")
public class GameRestController {
    private final GameHistoryRepository gameHistoryRepository;
    private final UserRepository userRepository;
    private final CardModelRepository cardRepository;
    private final GameRepository gameRepository;

    public GameRestController(GameRepository gameRepository, CardModelRepository cardRepository, GameHistoryRepository gameHistoryRepository, UserRepository userRepository) {
        this.gameHistoryRepository = gameHistoryRepository;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.gameRepository = gameRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createGame(@RequestBody GameCreationRequest request) {
        UserModel user1 = userRepository.findById(request.getUser1Id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User 1 not found"));
        UserModel user2 = userRepository.findById(request.getUser2Id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User 2 not found"));

        UserModel gameMaster = userRepository.findById(request.getGameMasterId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game master not found"));

        if (request.getDeck1CardIds() == null || request.getDeck1CardIds().isEmpty() ||
                request.getDeck2CardIds() == null || request.getDeck2CardIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each player must provide at least one card");
        }

        Game game = new Game();

        game.setUser1(user1);
        game.setUser2(user2);
        game.setGameMaster(gameMaster);

        if (!game.isValidGameMaster()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Game master must be one of the players");
        }

        game.initializeDecks();

        Set<CardModel> deck1Cards = request.getDeck1CardIds().stream()
                .map(cardId -> cardRepository.findById(cardId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + cardId)))
                .collect(Collectors.toSet());

        Set<CardModel> deck2Cards = request.getDeck2CardIds().stream()
                .map(cardId -> cardRepository.findById(cardId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + cardId)))
                .collect(Collectors.toSet());

        deck1Cards.forEach(game.getDeck1()::addCard);
        deck2Cards.forEach(game.getDeck2()::addCard);

        if (game.getDeck1().getSelectedCards().isEmpty() || game.getDeck2().getSelectedCards().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Failed to add cards. Make sure each player owns their respective cards.");
        }

        return ResponseEntity.ok(gameRepository.save(game));
    }

    @GetMapping("/history")
    public ResponseEntity<List<GameHistory>> getGameHistory(
            @RequestParam(required = false) Long receiverId,
            @RequestParam(required = false) Long emitterId,
            @RequestParam(required = false) Long roomId)
    {

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
