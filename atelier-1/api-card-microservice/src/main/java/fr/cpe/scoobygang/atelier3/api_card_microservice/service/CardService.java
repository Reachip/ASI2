package fr.cpe.scoobygang.atelier3.api_card_microservice.service;

import fr.cpe.scoobygang.common.dto.mapper.CardMapper;
import fr.cpe.scoobygang.common.dto.request.CardRequest;
import fr.cpe.scoobygang.common.model.Card;
import fr.cpe.scoobygang.common.model.User;
import fr.cpe.scoobygang.common.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getAllUserCard(int userId){
        Iterable<Card> iterable = cardRepository.findByOwnerId(userId);
        return StreamSupport.stream(iterable.spliterator(), false)
                .collect(Collectors.toList());
    }
    public Card saveCard(CardRequest cardRequest) {
        return cardRepository.save(CardMapper.INSTANCE.cardRequestToCard(cardRequest));
    }

    public Optional<Card> updateCard(int id, CardRequest cardRequest) {
        Optional<Card> optionalCard = cardRepository.findById(id);

        if (optionalCard.isPresent()) {
            Card cardToUpdate = optionalCard.get();
            CardMapper.INSTANCE.updateCard(cardToUpdate, cardRequest);
            cardRepository.save(cardToUpdate);
        }

        return Optional.empty();
    }

    public Optional<Card> getCard(int id) {
        return cardRepository.findById(id);
    }

    public List<Card> getCards() {
        Iterable<Card> iterable = cardRepository.findAll();
        return StreamSupport.stream(iterable.spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<Card> deleteCard(int id) {
        Optional<Card> optionalCard = cardRepository.findById(id);

        if (optionalCard.isPresent()) {
            cardRepository.delete(optionalCard.get());
            return optionalCard;
        }

        return Optional.empty();
    }

    public void attachUserToCard(User user)
    {
        // Récupère les cartes qui n'ont pas de propriétaire
        List<Card> cards = cardRepository.findNotOwnerCards();

        List<Card> shuffled = new ArrayList<>(cards);
        // Mélange les cartes
        Collections.shuffle(shuffled, new Random());

        List<Card> userCards = shuffled.subList(0, Math.min(5, shuffled.size()));
        // Save pour chaque carte
        userCards.forEach(card -> {
            card.setOwner(user);
        });

        cardRepository.saveAll(userCards);
    }

    public List<Card> getCardsFromStore(int storeId) {
        return cardRepository.findByStoreId(storeId);
    }
}

