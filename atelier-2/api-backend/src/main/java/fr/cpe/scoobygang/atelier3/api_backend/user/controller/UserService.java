package fr.cpe.scoobygang.atelier3.api_backend.user.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.card.Controller.CardModelService;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;

import org.springframework.stereotype.Service;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final CardModelService cardModelService;

	public UserService(UserRepository userRepository, CardModelService cardModelService) {
		this.userRepository = userRepository;
		this.cardModelService = cardModelService;
	}

	public List<UserModel> getAllUsers() {
		List<UserModel> userList = new ArrayList<>();
		userRepository.findAll().forEach(userList::add);
		return userList;
	}

	public Optional<UserModel> getUser(String id) {
		return userRepository.findById(Integer.valueOf(id));
	}

	public Optional<UserModel> getUser(Integer id) {
		return userRepository.findById(id);
	}

	public UserDTO addUser(UserDTO user) {
		UserModel u = fromUDtoToUModel(user);
		// needed to avoid detached entity passed to persist error
		UserModel u_saved=userRepository.save(u);
		List<CardModel> cardList = cardModelService.getRandCard(5);
		for (CardModel card : cardList) {
			u.addCard(card);
		}
		UserModel uBd = userRepository.save(u_saved);
		return DTOMapper.fromUserModelToUserDTO(uBd);
	}

	public UserDTO updateUser(UserDTO user) {
		UserModel u = fromUDtoToUModel(user);
		UserModel uBd =userRepository.save(u);
		return DTOMapper.fromUserModelToUserDTO(uBd);
	}

	public UserDTO updateUser(UserModel user) {
		UserModel uBd = userRepository.save(user);
		return DTOMapper.fromUserModelToUserDTO(uBd);
	}

	public void deleteUser(String id) {
		userRepository.deleteById(Integer.valueOf(id));
	}

	public List<UserModel> getUserByUsernamePwd(String username, String pwd) {
		List<UserModel> ulist = null;
		ulist = userRepository.findByUsernameAndPwd(username, pwd);
		return ulist;
	}

	private UserModel fromUDtoToUModel(UserDTO user) {
		UserModel u = new UserModel(user);
		List<CardModel> cardList = new ArrayList<CardModel>();
		for (Integer cardId : user.getCardList()) {
			Optional<CardModel> card = cardModelService.getCard(cardId);
			if (card.isPresent()) {
				cardList.add(card.get());
			}
		}
		return u;
	}

}
