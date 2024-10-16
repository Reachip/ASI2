package fr.cpe.scoobygang.common.dto.request;

import lombok.Getter;

@Getter
public class PutCardRoomRequest {
    int cardId;
    Long roomId;
}
