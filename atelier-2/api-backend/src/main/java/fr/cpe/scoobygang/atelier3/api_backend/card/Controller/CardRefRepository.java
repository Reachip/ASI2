package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardReference;
import org.springframework.data.repository.CrudRepository;


public interface CardRefRepository extends CrudRepository<CardReference, Integer> {

}
