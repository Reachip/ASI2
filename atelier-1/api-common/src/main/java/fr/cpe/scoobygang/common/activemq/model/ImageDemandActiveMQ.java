package fr.cpe.scoobygang.common.activemq.model;

import com.google.gson.GsonBuilder;
import fr.cpe.scoobygang.common.activemq.JsonConvertable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ImageDemandActiveMQ implements JsonConvertable {
    private String uuid;
    private String prompt;

    @Override
    public String toJson() {
        return new GsonBuilder().create().toJson(this);
    }

    public static ImageDemandActiveMQ fromJson(String json) {
        return new GsonBuilder().create().fromJson(json, ImageDemandActiveMQ.class);
    }
}