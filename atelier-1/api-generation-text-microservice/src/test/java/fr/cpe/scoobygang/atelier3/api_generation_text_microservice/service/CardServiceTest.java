package fr.cpe.scoobygang.atelier3.api_card_microservice.service;

import fr.cpe.scoobygang.common.dto.request.CardRequest;
import fr.cpe.scoobygang.common.dto.response.CardResponse;
import fr.cpe.scoobygang.common.model.Card;
import fr.cpe.scoobygang.common.model.User;
import fr.cpe.scoobygang.common.repository.CardRepository;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {
    @Mock
    private  CardRepository cardRepository;

    @InjectMocks
    private CardService cardService;

    @Test
    void getAllUserCardIsOk() {
        // Given
        Card card1 = new Card();
        card1.setDescription("card 1");

        // When
        Mockito.when(cardRepository.findByOwnerId(1)).thenReturn(List.of(card1));

        // Then
        List<Card> cards = cardService.getAllUserCard(1);
        Mockito.verify(cardRepository, Mockito.times(1)).findByOwnerId(1);
        assertEquals("card 1", cards.stream().findFirst().get().getDescription());
    }

    @Test
    void saveCard() {
        CardRequest cardRequest = new CardRequest();
        cardRequest.setName("Card 1");

        cardService.saveCard(cardRequest);

        Mockito.verify(cardRepository, Mockito.times(1)).save(Mockito.any(Card.class));

    }

    @Test
    void updateCardWhenCardIsNotFound() {
        CardRequest cardRequest = new CardRequest();
        cardRequest.setName("Card 2");

        Card card = new Card();
        card.setName("Card 1");

        Mockito.when(cardRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Card> updatedCard = cardService.updateCard(1, cardRequest);
        Mockito.verify(cardRepository, Mockito.times(0)).save(Mockito.any());

        assertTrue(updatedCard.isEmpty());
    }

    @Test
    void getCard() {
        cardService.getCard(1);
        Mockito.verify(cardRepository, Mockito.times(1)).findById(1);
    }

    @Test
    void getCards() {
        Mockito.when(cardRepository.findAll()).thenReturn(List.of(new Card(), new Card()));

        assertEquals(2, cardService.getCards().size());
        Mockito.verify(cardRepository, Mockito.times(1)).findAll();
    }

    @Test
    void deleteCardIsOk() {
        Mockito.when(cardRepository.findById(1)).thenReturn(Optional.of(new Card()));

        cardService.deleteCard(1);
        Mockito.verify(cardRepository, Mockito.times(1)).delete(Mockito.any());
    }

    @Test
    void deleteCardIsNotOk() {
        Mockito.when(cardRepository.findById(1)).thenReturn(Optional.empty());

        cardService.deleteCard(1);
        Mockito.verify(cardRepository, Mockito.times(0)).delete(Mockito.any());
    }

    @Test
    void attachUserToCard() {
    }
}