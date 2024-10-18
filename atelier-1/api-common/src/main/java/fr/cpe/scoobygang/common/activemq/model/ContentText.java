package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentText extends Content {
    private String prompt;

    public ContentText(String value) {
        super(value);
    }
}