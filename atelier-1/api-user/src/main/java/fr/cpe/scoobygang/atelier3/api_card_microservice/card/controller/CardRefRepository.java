package fr.cpe.scoobygang.atelier3.api_card_microservice.card.controller;

import fr.cpe.scoobygang.atelier3.api_card_microservice.card.model.CardReference;
import org.springframework.data.repository.CrudRepository;

public interface CadRefRepository extends CrudRepository<CardReference, Integer> {
}
