package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Property extends Content {
    private Float valueToDispatch;
    private int nb_of_colors;
    private Float randPart;
}
