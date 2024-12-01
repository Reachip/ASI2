package fr.cpe.scoobygang.atelier3.api_backend.card.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RandomCardService {
    private final List<Map<String, Object>> cardData;
    private final Random random;

    public RandomCardService() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("cards.json");
            if (inputStream == null) {
                throw new RuntimeException("cards.json file not found");
            }
            cardData = mapper.readValue(inputStream, new TypeReference<>() {});
            random = new Random();
        } catch (IOException e) {
            throw new RuntimeException("Error loading card data", e);
        }
    }

    public CardModel generateRandomCard() {
        Map<String, Object> selectedCard = cardData.get(random.nextInt(cardData.size()));

        return new CardModel(
                (String) selectedCard.get("name"),
                (String) selectedCard.get("description"),
                "Unknown",
                "Unknown",
                ((Number) selectedCard.get("energy")).floatValue(),
                ((Number) selectedCard.get("hp")).floatValue(),
                ((Number) selectedCard.get("defense")).floatValue(),
                ((Number) selectedCard.get("attack")).floatValue(),
                (String) selectedCard.get("img_src"),
                null,
                0f
        );
    }

    public List<CardModel> generateRandomCards(int count) {
        Set<Map<String, Object>> selectedCards = new HashSet<>();
        List<CardModel> randomCards = IntStream.range(0, count)
                .mapToObj(i -> {
                    Map<String, Object> randomCard;
                    do {
                        randomCard = cardData.get(random.nextInt(cardData.size()));
                    } while (!selectedCards.add(randomCard));
                    return randomCard;
                })
                .map(cardData -> new CardModel(
                        (String) cardData.get("name"),
                        (String) cardData.get("description"),
                        "Unknown",
                        "Unknown",
                        ((Number) cardData.get("energy")).floatValue(),
                        ((Number) cardData.get("hp")).floatValue(),
                        ((Number) cardData.get("defense")).floatValue(),
                        ((Number) cardData.get("attack")).floatValue(),
                        (String) cardData.get("img_src"),
                        null,
                        0f
                ))
                .collect(Collectors.toList());
        return randomCards;
    }
}