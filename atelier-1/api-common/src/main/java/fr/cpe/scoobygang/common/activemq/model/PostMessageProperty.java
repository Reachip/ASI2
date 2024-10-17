package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostMessageProperty extends Content {
    private Float valueToDispatch;
    private int nbOfColors;
    private Float randPart;
}
