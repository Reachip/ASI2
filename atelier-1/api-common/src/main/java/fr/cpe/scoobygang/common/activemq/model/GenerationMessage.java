package fr.cpe.scoobygang.common.activemq.model;

import fr.cpe.scoobygang.common.activemq.JsonConvertable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GenerationMessage implements JsonConvertable {
    private String uuid;
    private Content content;

    @Override
    public String toJson() {
        return "";
    }
}