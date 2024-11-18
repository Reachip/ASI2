package fr.cpe.scoobygang.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MessageRequest {
    private String fromUserId;
    private String toUserId;
}
