package fr.cpe.scoobygang.common.activemq.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageActiveMQ implements Serializable {
    private Long fromUserId;
    private String fromUsername;
    private Long toUserId;
    private String toUsername;
    private String content;
    private LocalDateTime time;

    @Override
    public String toString() {
        return "MessageActiveMQ{" +
                "fromUserId='" + fromUserId + '\'' +
                ", fromUsername='" + fromUsername + '\'' +
                ", toUserId='" + toUserId + '\'' +
                ", toUsername='" + toUsername + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + time + '\'' +
                '}';
    }
}