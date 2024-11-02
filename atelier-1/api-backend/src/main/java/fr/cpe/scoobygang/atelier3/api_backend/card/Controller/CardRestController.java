package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserService;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.dto.request.CardDemandRequest;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.model.ActiveMQTransaction;
import fr.cpe.scoobygang.atelier3.api_orchestrator_microservice.repository.ActiveMQTransactionRepository;
import fr.cpe.scoobygang.common.activemq.*;
import fr.cpe.scoobygang.common.activemq.model.CardDemandActiveMQ;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController

public class CardRestController {

	private final CardModelService cardModelService;
	private final UserService userService;
	private BusService busService;
	private ActiveMQTransactionRepository activeMQTransactionRepository;
	
	public CardRestController(CardModelService cardModelService, UserService userService) {
		this.cardModelService=cardModelService;
		this.userService = userService;
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/cards")
	private List<CardDTO> getAllCards() {
		List<CardDTO> cLightList=new ArrayList<>();
		for(CardModel c:cardModelService.getAllCardModel()){
			cLightList.add(new CardDTO(c));
		}
		return cLightList;

	}
	
	@RequestMapping(method=RequestMethod.GET, value="/card/{id}")
	private CardDTO getCard(@PathVariable String id) {
		Optional<CardModel> rcard;
		rcard= cardModelService.getCard(Integer.valueOf(id));
		if(rcard.isPresent()) {
			return DTOMapper.fromCardModelToCardDTO(rcard.get());
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Card id:"+id+", not found",null);

	}
	
	@RequestMapping(method=RequestMethod.POST,value="/card")
	public CardDTO addCard(@RequestBody CardDTO card) {
		return cardModelService.addCard(DTOMapper.fromCardDtoToCardModel(card));
	}
	
	@RequestMapping(method=RequestMethod.PUT,value="/card/{id}")
	public CardDTO updateCard(@RequestBody CardDTO card,@PathVariable String id) {
		card.setId(Integer.valueOf(id));
		 return cardModelService.updateCard(DTOMapper.fromCardDtoToCardModel(card));
	}
	
	@RequestMapping(method=RequestMethod.DELETE,value="/card/{id}")
	public void deleteUser(@PathVariable String id) {
		cardModelService.deleteCardModel(Integer.valueOf(id));
	}

	// Send a card demand
	@PostMapping("/generateCard")
	public ResponseEntity<Void> cardDemand(CardDemandRequest cardDemand) {
		CardGenerationService cardGenerationService = new CardGenerationService();
		cardGenerationService.sendGenerationCardDemand(cardDemand.getPromptImage(), cardDemand.getPromptText());
		return ResponseEntity.ok().build();
	}

	// Receive a card from the orchestrator
	@PostMapping("/receiveCard")
	public ResponseEntity<Void> receiveCard(@RequestBody CardDTO cardDto)
	{
		CardModel card = DTOMapper.fromCardDtoToCardModel(cardDto);
		UserModel user = card.getUser();

		cardModelService.addCard(card);

		user.setAccount(user.getAccount() - card.getPrice());
		userService.updateUser(user);

		return ResponseEntity.ok().build();
	}
}
