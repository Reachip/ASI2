package fr.cpe.scoobygang.common.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class UserRequest {
    private int id;
    private String username;
    private String password;
    private String surname;
    private String name;
    private String email;
    private double balance = 0;
    private List<CardRequest> cardList = new ArrayList<>();
}
