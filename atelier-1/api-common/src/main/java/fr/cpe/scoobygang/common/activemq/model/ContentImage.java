package fr.cpe.scoobygang.common.activemq.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ContentImage extends Content {
    private String url;
}