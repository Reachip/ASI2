package fr.cpe.scoobygang.atelier3.api_backend.common.tools;

import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardDTO;
import fr.cpe.scoobygang.atelier3.api_backend.card.model.CardModel;
import fr.cpe.scoobygang.atelier3.api_backend.message.model.Message;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserCardsDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserDTO;
import fr.cpe.scoobygang.atelier3.api_backend.user.model.UserModel;
import fr.cpe.scoobygang.common.activemq.model.MessageActiveMQ;

public class DTOMapper {
	
	public static CardDTO fromCardModelToCardDTO(CardModel cM) {
		CardDTO cDto =new CardDTO(cM);
		return cDto;
	}
	
	public static CardModel fromCardDtoToCardModel(CardDTO cD) {
		CardModel cm=new CardModel(cD);
		cm.setEnergy(cD.getEnergy());
		cm.setHp(cD.getHp());
		cm.setDefence(cD.getDefence());
		cm.setAttack(cD.getAttack());
		cm.setPrice(cD.getPrice());
		cm.setId(cD.getId());
		return cm;
	}
	
	
	public static UserDTO fromUserModelToUserDTO(UserModel uM) {
		UserDTO uDto =new UserDTO(uM);
		return uDto;
	}

	public static UserCardsDTO fromUserModelToUserCardsDTO(UserModel uM) {
		return new UserCardsDTO(uM);
	}

	public static Message fromMessageActiveMQToMessage(MessageActiveMQ messageActiveMQ) {
		Message message = new Message();
		message.setFromId(messageActiveMQ.getFromId());
		message.setFromUsername(messageActiveMQ.getFromUsername());
		message.setToId(messageActiveMQ.getToId());
		message.setToUsername(messageActiveMQ.getToUsername());
		message.setContent(messageActiveMQ.getContent());
		message.setTime(messageActiveMQ.getTime());
		return message;
	}
}
