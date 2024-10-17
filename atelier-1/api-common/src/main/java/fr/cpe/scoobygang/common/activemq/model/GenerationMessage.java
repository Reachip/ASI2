package fr.cpe.scoobygang.common.activemq.model;

import fr.cpe.scoobygang.common.activemq.JsonConvertable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerationMessage implements JsonConvertable {
    private String uuid;
    private Content content;

    @Override
    public String toJson() {
        return "";
    }
}