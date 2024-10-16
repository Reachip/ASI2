package fr.cpe.scoobygang.atelier3.api_card_microservice.controller;


import fr.cpe.scoobygang.atelier3.api_card_microservice.service.CardService;
import fr.cpe.scoobygang.common.jwt.JWT;
import fr.cpe.scoobygang.common.model.Card;
import fr.cpe.scoobygang.common.repository.CardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class CardControllerTest {
    @Autowired
    private CardController cardController;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CardService cardService;

    @Value("${api-microservice.port}")
    private int servicePort;
    private String authorization;


    @BeforeEach
    public void setup() {
        JWT jwt = new JWT("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5IiwiZXhwIjoxNzE2OTcwMDc1fQ.M6uAxmNSWELCR1JHTRLgLSG0IcbJTTWKeNG6vq1RaKTx78sNjHbKJo7Zhx5eIBSsDBMtnr_HcJ6Rx-IRDM5CUA");

        this.authorization = "Bearer " + jwt.getToken();
    }

    // @Test
    void deleteCard() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        HttpEntity request = new HttpEntity<>(null, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Card> cardResponse =  restTemplate.exchange("http://localhost:"+servicePort+"/card/card/1", HttpMethod.GET,request, Card.class);

        if (!cardResponse.getStatusCode().is2xxSuccessful()) return ;

        Card cardToDelete = cardResponse.getBody();

        // Delete
        restTemplate.exchange("http://localhost:"+servicePort+"/card/card/"+cardToDelete.getId(), HttpMethod.DELETE, request, Void.class);

        //cardController.deleteCard(this.authorization, cardToDelete.getId());
        assertTrue(cardRepository.findById(1).isEmpty());
    }

    /*
    @Test
    void createCard() {
        CardRequest cardRequest = new CardRequest();
        cardRequest.setName("Jonny's card");

       ResponseEntity<Card> createdCard = cardController.createCard(this.authorization, cardRequest);

       assertEquals(201, createdCard.getStatusCode().value());

       Card body = createdCard.getBody();

       assertEquals("Jonny's card", body.getName());
       assertEquals("Jonny's card", cardRepository.findById(body.getId()).get().getName());
    }

    @Test
    void updateCard() {
        Card card = new Card();
        card.setName("Jonny's card");
        card = cardRepository.save(card);

        CardRequest cardRequest  = new CardRequest();
        cardRequest.setName("Paul's card");

        cardController.updateCard(this.authorization, card.getId(), cardRequest);
        assertEquals("Paul's card", cardRepository.findById(card.getId()).get().getName());
    }

    @Test
    void getCard() {
        Card card = cardRepository.findAll().iterator().next();
        ResponseEntity<Card> cardRequest = cardController.getCard(authorization, card.getId());



        assertEquals(200, cardRequest.getStatusCode().value());
        assertEquals(card.getName(), cardRequest.getBody().getName());
    }

    @Test
    void getCards() {
        ResponseEntity<List<CardResponse>> cards = cardController.getCards(this.authorization);
        List<CardResponse> response = cards.getBody();

        assertEquals(200, cards.getStatusCode().value());
        assertEquals(57, response.size());
    }

    @Test
    void getCurrentUserCards() {
        ResponseEntity<List<CardResponse>> cards = cardController.getCurrentUserCards(this.authorization);
        List<CardResponse> response = cards.getBody();

        assertEquals(200, cards.getStatusCode().value());

        assert response != null;
        assertFalse(response.isEmpty());
    }

     */
}