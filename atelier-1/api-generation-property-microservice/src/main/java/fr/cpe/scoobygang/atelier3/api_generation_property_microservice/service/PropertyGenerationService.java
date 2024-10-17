package fr.cpe.scoobygang.atelier3.api_generation_property_microservice.service;

import org.springframework.stereotype.Service;
import tp.cpe.ImgToProperties;

import java.util.Map;

@Service
public class PropertyGenerationService {

   public void createProperty(String urlImg){
       Map<String, Float> result = ImgToProperties.getPropertiesFromImg(urlImg, 100f, 4,0.3f,true);
   }
}
