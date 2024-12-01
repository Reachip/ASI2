package fr.cpe.scoobygang.atelier3.api_backend.card.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.card.dto.CardDemandDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.common.dto.HttpBasicResponse;
import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.controller.UserService;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
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

	@Autowired
	private CardGenerationDemandService cardGenerationDemandService;

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
	public ResponseEntity<HttpBasicResponse<String>> cardDemand(@RequestBody CardDemandDTO cardDemandDTO)
	{
		// Check user account > 100
		Optional<UserModel> optionalUserModel = userService.getUserByUsername(cardDemandDTO.getUsername());

		if (optionalUserModel.isEmpty()) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body(new HttpBasicResponse<>(HttpStatus.UNAUTHORIZED.value(), "User not found"));
		}

		UserModel userModel = optionalUserModel.get();

		if (userModel.getAccount() < 100)
		{
			return ResponseEntity
					.status(HttpStatus.FORBIDDEN)
					.body(new HttpBasicResponse<>(HttpStatus.FORBIDDEN.value(), "Not enough money"));
		}

		cardGenerationDemandService.sendGenerationCardDemand(cardDemandDTO.getPromptImage(), cardDemandDTO.getPromptText(), String.valueOf(userModel.getId()), cardDemandDTO.getCardName());
		return ResponseEntity.status(HttpStatus.CREATED).body(new HttpBasicResponse<>(HttpStatus.CREATED.value(), "Successfully send card genetation demand"));
	}
}
