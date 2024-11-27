package fr.cpe.scoobygang.atelier3.api_backend.game.controller;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelRepository;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.game.dto.GameCreationRequest;
import fr.cpe.scoobygang.atelier3.api_backend.game.entity.Game;
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
    private final UserRepository userRepository;
    private final CardModelRepository cardRepository;
    private final GameRepository gameRepository;

    public GameRestController(GameRepository gameRepository, CardModelRepository cardRepository, UserRepository userRepository) {
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

        Game game = new Game();

        game.setUser1(user1);
        game.setUser2(user2);

        // Sauvegarder l'entité Game
        Game savedGame = gameRepository.save(game);

        // Retourner uniquement l'ID dans la réponse
        return ResponseEntity.ok(savedGame.getId());
    }
}
