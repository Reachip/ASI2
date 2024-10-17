package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentProperty extends Content {
    private Float valueToDispatch;
    private int nbOfColors;
    private Float randPart;
}
