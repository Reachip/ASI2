package fr.cpe.scoobygang.atelier3.api_backend.message.repository;

import fr.cpe.scoobygang.atelier3.api_backend.message.model.Conversation;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ConversationRepository extends CrudRepository<Conversation, Long> {
	Optional<Conversation> findByUserId1AndUserId2(String userId1, String userId2);
}
