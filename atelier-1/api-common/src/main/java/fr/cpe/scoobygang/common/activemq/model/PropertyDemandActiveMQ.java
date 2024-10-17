package fr.cpe.scoobygang.common.activemq.model;

import fr.cpe.scoobygang.common.activemq.JsonConvertable;

public class PropertyDemandActiveMQ implements JsonConvertable {
    private String id_transaction;
    private String desc;

    @Override
    public String toJson() {
        return this.toJson();
    }
}
