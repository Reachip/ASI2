package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CardModelRepository extends CrudRepository<CardModel, Integer> {
    List<CardModel> findByUser(UserModel u);

    List<CardModel> findAll();
}
