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
    private Long fromId;
    private String fromUsername;
    private Long toId;
    private String toUsername;
    private String content;
    private LocalDateTime time;

    @Override
    public String toString() {
        return "MessageActiveMQ{" +
                "fromId='" + fromId + '\'' +
                ", fromUsername='" + fromUsername + '\'' +
                ", toId='" + toId + '\'' +
                ", toUsername='" + toUsername + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + time + '\'' +
                '}';
    }
}