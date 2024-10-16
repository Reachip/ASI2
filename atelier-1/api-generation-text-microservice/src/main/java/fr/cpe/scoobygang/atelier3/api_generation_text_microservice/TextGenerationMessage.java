package fr.cpe.scoobygang.atelier3.api_generation_text_microservice;

import fr.cpe.scoobygang.common.activemq.JsonConvertable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TextGenerationMessage implements JsonConvertable {
    private String uuid;
    private Content content;

    @Override
    public String toJson() {
        return "";
    }
}

// A METTRE DANS COMMON
// dans package activemq puis créer package models avec ça dedans