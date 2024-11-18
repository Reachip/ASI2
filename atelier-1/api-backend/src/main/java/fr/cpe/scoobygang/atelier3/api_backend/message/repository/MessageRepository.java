package fr.cpe.scoobygang.atelier3.api_backend.message.repository;

import fr.cpe.scoobygang.atelier3.api_backend.message.model.Message;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends CrudRepository<Message, Long> {
	List<Message> findByConversationId(String conversationId);

}
