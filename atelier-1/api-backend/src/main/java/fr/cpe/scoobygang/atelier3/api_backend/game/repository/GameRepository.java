package fr.cpe.scoobygang.atelier3.api_backend.game.repository;

import fr.cpe.scoobygang.atelier3.api_backend.game.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {}
