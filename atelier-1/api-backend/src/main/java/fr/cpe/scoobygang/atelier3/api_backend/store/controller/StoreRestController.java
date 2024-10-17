package fr.cpe.scoobygang.atelier3.api_backend.store.controller;

import java.util.ArrayList;
import java.util.List;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.store.model.StoreOrder;
import fr.cpe.scoobygang.atelier3.api_backend.store.model.StoreTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
@RequestMapping(value="/store")
public class StoreRestController {

	private final StoreService storeService;

	public StoreRestController(StoreService storeService) {
		this.storeService = storeService;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/buy")
	private boolean buyCards(@RequestBody StoreOrder order) {
		return storeService.buyCardInternal(order.getUser_id(), order.getCard_id());
	}

	@RequestMapping(method = RequestMethod.POST, value = "/buy/btob")
	private boolean buyCardBtoB(@RequestBody StoreOrder order) {
		return storeService.buyCardBtob(order.getUser_id(), order.getCard_id(),order.getStore_id());
	}

	@RequestMapping(method = RequestMethod.POST, value = "/sell")
	private boolean sellCard(@RequestBody StoreOrder order) {
		return storeService.sellCardInternal(order.getUser_id(), order.getCard_id());
	}

	@RequestMapping(method = RequestMethod.GET, value = "/transaction")
	private List<StoreTransaction> getTransaction() {
		return storeService.getAllTransactions();
	}


	@RequestMapping(method=RequestMethod.GET, value="/cards_to_sell")
	private List<CardDTO> getCardsToSell() {
		return storeService.listCardToSell();
	}

	@RequestMapping(method=RequestMethod.GET, value="/cards_to_sell/btob")
	private List<CardDTO> getCardsToSellBToB() {
		return storeService.listCardToSellBtob();
	}

}
