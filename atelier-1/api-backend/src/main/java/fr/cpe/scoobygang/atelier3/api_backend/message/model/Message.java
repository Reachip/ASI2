package fr.cpe.scoobygang.atelier3.api_backend.message.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String conversationId;
    private Long fromId;
    private String fromUsername;
    private Long toId;
    private String toUsername;
    private String content;
    private LocalDateTime time;

    @Override
    public String toString() {
        return "MessageActiveMQ{" +
                "conversationId='" + conversationId + '\'' +
                "fromId='" + fromId + '\'' +
                ", fromUsername='" + fromUsername + '\'' +
                ", toId='" + toId + '\'' +
                ", toUsername='" + toUsername + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + time + '\'' +
                '}';
    }
}