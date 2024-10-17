package fr.cpe.scoobygang.common.activemq.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostMessageImage extends Content {
    private String url;
}