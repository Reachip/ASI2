package fr.cpe.scoobygang.atelier3.api_backend.handler.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class Message<T> implements Serializable {
    private String type;
    private T data;
}
