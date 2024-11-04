package fr.cpe.scoobygang.atelier3.api_backend.user.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.AuthDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class UserRestController {

	private final UserService userService;

	public UserRestController(UserService userService) {
		this.userService = userService;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/users")
	private List<UserDTO> getAllUsers() {
		List<UserDTO> uDTOList = new ArrayList<UserDTO>();
		for (UserModel uM : userService.getAllUsers()) {
			uDTOList.add(DTOMapper.fromUserModelToUserDTO(uM));
		}
		return uDTOList;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/user/{id}")
	private UserDTO getUser(@PathVariable String id) {
		Optional<UserModel> ruser;
		ruser = userService.getUser(id);
		if (ruser.isPresent()) {
			return DTOMapper.fromUserModelToUserDTO(ruser.get());
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id:" + id + ", not found", null);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/user")
	public UserDTO addUser(@RequestBody UserDTO user) {
		return userService.addUser(user);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/user/{id}")
	public UserDTO updateUser(@RequestBody UserDTO user, @PathVariable String id) {
		user.setId(Integer.valueOf(id));
		return userService.updateUser(user);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/user/{id}")
	public void deleteUser(@PathVariable String id) {
		userService.deleteUser(id);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auth")
	public ResponseEntity<?> authenticateUser(@RequestBody AuthDTO authDto) {
		List<UserModel> uList = userService.getUserByUsernamePwd(authDto.getUsername(), authDto.getPassword());
		if (uList.size() > 0) {
			return ResponseEntity.ok(uList.get(0).getId());
		}
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Authentication Failed");
	}
}