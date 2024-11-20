package fr.cpe.scoobygang.atelier3.api_backend.message.service;

import fr.cpe.scoobygang.atelier3.api_backend.common.tools.DTOMapper;
import fr.cpe.scoobygang.atelier3.api_backend.message.model.Conversation;
import fr.cpe.scoobygang.atelier3.api_backend.message.repository.ConversationRepository;
import fr.cpe.scoobygang.atelier3.api_backend.message.repository.MessageRepository;
import fr.cpe.scoobygang.atelier3.api_backend.message.model.Message;
import fr.cpe.scoobygang.atelier3.api_backend.receiver.MessageHistoryReceiver;
import fr.cpe.scoobygang.common.activemq.model.MessageActiveMQ;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    private static final Logger logger = LoggerFactory.getLogger(MessageHistoryReceiver.class);

    public List<Message> getConversationHistory(Long userId1, Long userId2) {
        // Comparer les deux identifiants pour assurer que le plus petit ID est en premier
        Long minId = userId1.compareTo(userId2) < 0 ? userId1 : userId2;
        Long maxId = userId1.compareTo(userId2) < 0 ? userId2 : userId1;

        // Récupérer la conversation en utilisant les identifiants ordonnés
        Optional<Conversation> conversation = conversationRepository.findByUserId1AndUserId2(minId, maxId);

        if(conversation.isPresent()) return messageRepository.findByConversationId(String.valueOf(conversation.get().getId()));
        else return Collections.emptyList();

    }

    public void saveMessage(MessageActiveMQ messageActiveMQ){
        Long fromUserId = messageActiveMQ.getFromUserId();
        Long toUserId = messageActiveMQ.getToUserId();

        Long userId1 = 0L;
        Long userId2 = 0L;
        // 0 - 0 chat global
        if (fromUserId == 0 || toUserId == 0) {
            userId1 = 0L;
            userId2 = 0L;
        }
        else{
            userId1 = fromUserId.compareTo(toUserId) < 0 ? fromUserId : toUserId;
            userId2 = fromUserId.compareTo(toUserId) < 0 ? toUserId : fromUserId;
        }

        Optional<Conversation> conversationOptional =  conversationRepository.findByUserId1AndUserId2(userId1, userId2);

        Message newMessage =  DTOMapper.fromMessageActiveMQToMessage(messageActiveMQ);

        if(conversationOptional.isPresent()){
            newMessage.setConversationId(String.valueOf(conversationOptional.get().getId()));

            messageRepository.save(newMessage);
        }
        else {
            Conversation newConversation = new Conversation();
            newConversation.setUserId1(userId1);
            newConversation.setUserId2(userId2);

            logger.info("Création de la conversation en bd entre: {} et {}", userId1, userId2);

            // Sauvegarder la nouvelle conversation avant de récupérer son ID
            newConversation = conversationRepository.save(newConversation);

            newMessage.setConversationId(String.valueOf(newConversation.getId()));
            messageRepository.save(newMessage);
        }
        logger.info("Sauvegarde du message: {}", newMessage);
    }

}
