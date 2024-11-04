package fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service;

import fr.cpe.scoobygang.common.activemq.model.CardProperties;
import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;

@Service
public class PropertyGenerationService {
    public CardProperties createProperty(String urlImg) {
        return CardProperties.from(ImgToProperties.getPropertiesFromImg(urlImg, 100f, 4, 0.3f, false));
    }
}
