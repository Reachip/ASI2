package fr.cpe.scoobygang.atelier3.api_backend.message.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId1;
    private Long userId2;

    @Override
    public String toString() {
        return "Conversation{" +
                "chatId='" + id + '\'' +
                "userId1='" + userId1 + '\'' +
                ", userId2='" + userId2 + '\'' +
                '}';
    }
}
