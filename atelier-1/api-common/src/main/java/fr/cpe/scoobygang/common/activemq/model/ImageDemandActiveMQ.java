package fr.cpe.scoobygang.common.activemq.model;

import fr.cpe.scoobygang.common.activemq.JsonConvertable;

public class ImageDemandActiveMQ implements JsonConvertable {
    private String uuid;
    private String prompt;

    @Override
    public String toJson() {
        return this.toJson();
    }
}