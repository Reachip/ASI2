package fr.cpe.scoobygang.atelier3.api_backend.store.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelService;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.store.model.StoreAction;
import fr.cpe.scoobygang.atelier3.api_backend.store.model.StoreTransaction;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserService;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.stereotype.Service;

@Service
public class StoreService {

	private final CardModelService cardService;
	private final UserService userService;
	private final StoreRepository storeRepository;

	public final static Integer CURRENT_STORE_ID = -1;

	public StoreService(CardModelService cardService, UserService userService, StoreRepository storeRepository) {
		this.cardService = cardService;
		this.userService = userService;
		this.storeRepository = storeRepository;
	}

	public boolean buyCardInternal(Integer user_id, Integer card_id) {
		return buyCard(user_id, card_id, CURRENT_STORE_ID);
	}
	public boolean buyCard(Integer user_id, Integer card_id, Integer store_id) {
		Optional<UserModel> u_option = userService.getUser(user_id);
		Optional<CardModel> c_option = cardService.getCard(card_id);
		if (!u_option.isPresent() || !c_option.isPresent()) {
			return false;
		}
		UserModel u = u_option.get();
		CardModel c = c_option.get();
		if (u.getAccount() > c.getPrice()) {
			u.addCard(c);
			u.setAccount(u.getAccount() - c.getPrice());
			userService.updateUser(u);
			StoreTransaction sT = new StoreTransaction(user_id, card_id,store_id,c.getPrice(), StoreAction.BUY);
			storeRepository.save(sT);
			return true;
		} else {
			return false;
		}
	}

	public boolean sellCardInternal(Integer user_id, Integer card_id) {
		return sellCard(user_id,card_id, CURRENT_STORE_ID);

	}

	public boolean sellCard(Integer user_id, Integer card_id, Integer store_id) {
		Optional<UserModel> u_option = userService.getUser(user_id);
		Optional<CardModel> c_option = cardService.getCard(card_id);
		if (!u_option.isPresent() || !c_option.isPresent()) {
			return false;
		}
		UserModel u = u_option.get();
		CardModel c = c_option.get();

		c.setUser(null);
		cardService.updateCard(c);
		u.setAccount(u.getAccount() + c.computePrice());
		userService.updateUser(u);
		StoreTransaction sT = new StoreTransaction(user_id, card_id,store_id, c.computePrice(), StoreAction.SELL);
		storeRepository.save(sT);
		return true;
	}

	public List<StoreTransaction> getAllTransactions() {
		List<StoreTransaction> sTList = new ArrayList<>();
		this.storeRepository.findAll().forEach(sTList::add);
		return sTList;

	}

	public List<CardDTO> listCardToSell() {
		List<CardDTO> list=new ArrayList<>();
		for( CardModel c : cardService.getAllCardToSell()){
			CardDTO cLight=new CardDTO(c);
			list.add(cLight);
		}
		return list;
	}

	public List<CardDTO> listCardToBuy(int user_id) {
		List<CardDTO> list=new ArrayList<>();
		for( CardModel c : cardService.getAllCardToBuy(user_id)){
			CardDTO cLight=new CardDTO(c);
			list.add(cLight);
		}
		return list;
	}

	public List<CardDTO> listCardToSellBtob() {
		//TODO add Store Discovery and list card of other services
		return  listCardToSell();
	}

	public boolean buyCardBtob(int userId, int cardId, int storeId) {
		//Here we assume that the other Store guaranty that money has been removed form its user
		Optional<CardModel> c_option = cardService.getCard(cardId);
		if (!c_option.isPresent()) {
			return false;
		}
		CardModel c = c_option.get();
		// Here we assume that the other store managed the sold card
		// So sold card is removed of the current database
		cardService.deleteCardModel(c.getId());
		StoreTransaction sT = new StoreTransaction(userId, cardId,storeId,c.getPrice(),StoreAction.BUY);
		storeRepository.save(sT);
		return true;
	}
}
