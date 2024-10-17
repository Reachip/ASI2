package fr.cpe.scoobygang.atelier3.api_backend.store.controller;

import fr.cpe.scoobygang.atelier3.api_backend.store.model.StoreTransaction;
import org.springframework.data.repository.CrudRepository;


public interface StoreRepository extends CrudRepository<StoreTransaction, Integer> {
	

}
