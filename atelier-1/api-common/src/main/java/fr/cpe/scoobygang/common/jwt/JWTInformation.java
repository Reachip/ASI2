package fr.cpe.scoobygang.common.jwt;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class JWTInformation {
    private int userID;
}
