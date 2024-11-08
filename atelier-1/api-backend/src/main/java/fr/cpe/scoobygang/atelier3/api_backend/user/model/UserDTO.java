package fr.cpe.scoobygang.atelier3.api_backend.user.model;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;

import java.util.HashSet;
import java.util.Set;


public class UserDTO {
	private Integer id;
	private String pwd;
	private float account;
	private String lastName;
	private String surName;
	private String username;
	private String email;
	private Set<Integer> cardList = new HashSet<>();
	
	public UserDTO() {
	}

	public UserDTO(UserModel user) {
		this.id = user.getId();
		this.pwd = user.getPwd();
		this.account = user.getAccount();
		this.lastName = user.getLastName();
		this.surName = user.getSurName();
		this.username = user.getUsername();
		this.email = user.getEmail();
		for (CardModel card : user.getCardList()) {
			this.cardList.add(card.getId());
		}
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public Set<Integer> getCardList() {
		return cardList;
	}

	public void setCardList(Set<Integer> cardList) {
		this.cardList = cardList;
	}

	public float getAccount() {
		return account;
	}

	public void setAccount(float account) {
		this.account = account;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getSurName() {
		return surName;
	}

	public void setSurName(String surName) {
		this.surName = surName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
