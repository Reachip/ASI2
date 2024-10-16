package fr.cpe.scoobygang.common.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserPutRequest {
    private String username;
    private String surname;
    private String name;
    private String email;
}
