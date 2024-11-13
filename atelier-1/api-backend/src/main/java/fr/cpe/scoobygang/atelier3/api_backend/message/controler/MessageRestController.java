package fr.cpe.scoobygang.atelier3.api_backend.message.controler;

import fr.cpe.scoobygang.atelier3.api_backend.message.model.Message;
import fr.cpe.scoobygang.atelier3.api_backend.message.service.MessageService;
import fr.cpe.scoobygang.common.dto.request.MessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class MessageRestController {

    @Autowired
    private MessageService messageService;

    @RequestMapping(method = RequestMethod.GET, value = "/messages")
    private List<Message> getConversationHistory(@RequestParam String userId1, @RequestParam String userId2) {
        return messageService.getConversationHistory(userId1,userId2);
    }

}
