package fr.cpe.scoobygang.atelier3.api_backend.message.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

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
    private String fromUserId;
    private String fromUsername;
    private String toUserId;
    private String toUsername;
    private String content;
    private String time;

    @Override
    public String toString() {
        return "MessageActiveMQ{" +
                "conversationId='" + conversationId + '\'' +
                "fromUserId='" + fromUserId + '\'' +
                ", fromUsername='" + fromUsername + '\'' +
                ", toUserId='" + toUserId + '\'' +
                ", toUsername='" + toUsername + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + time + '\'' +
                '}';
    }
}