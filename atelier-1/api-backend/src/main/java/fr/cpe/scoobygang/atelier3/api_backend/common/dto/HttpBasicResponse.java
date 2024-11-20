package fr.cpe.scoobygang.atelier3.api_backend.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
public class HttpBasicResponse <T extends Serializable> {
    private int code;
    private T message;
}
