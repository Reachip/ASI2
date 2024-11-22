package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.card.service.RandomCardService;
import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import org.springframework.stereotype.Service;

@Service
public class CardModelService {
	private final CardModelRepository cardRepository;
	private final RandomCardService randomCardService;

	public CardModelService(RandomCardService randomCardService, CardModelRepository cardRepository) {
		this.cardRepository = cardRepository;
		this.randomCardService = randomCardService;
	}
	
	public List<CardModel> getAllCardModel() {
		List<CardModel> cardList = new ArrayList<>();
		cardRepository.findAll().forEach(cardList::add);
		return cardList;
	}

	public CardDTO addCard(CardModel cardModel) {



		CardModel cDb=cardRepository.save(cardModel);
		return DTOMapper.fromCardModelToCardDTO(cDb);
	}

	public CardDTO updateCard(CardModel cardModel) {
		CardModel cDb=cardRepository.save(cardModel);
		return DTOMapper.fromCardModelToCardDTO(cDb);
	}
	public Optional<CardModel> getCard(Integer id) {
		return cardRepository.findById(id);
	}
	
	public void deleteCardModel(Integer id) {
		cardRepository.deleteById(id);
	}
	
	public List<CardModel> getRandCard(int nbr){
		List<CardModel> cardList=new ArrayList<>();
		for(int i=0;i<nbr;i++) {
			cardList.add(randomCardService.generateRandomCard());
		}
		return cardList;
	}


	public List<CardModel> getAllCardToSell(){
		return this.cardRepository.findByUser(null);
	}
}

