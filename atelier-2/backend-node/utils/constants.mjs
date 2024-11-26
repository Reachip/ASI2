// Hash pour stocker les utilisateurs connectés avec leur ID, nom d'utilisateur, et socket
export const CONNECTED_USERS_HASH = "connectedUsers";

// Hash pour stocker les rooms associées à chaque utilisateur
export const USER_ROOMS_HASH = "userRooms";

// Hash pour stocker les utilisateurs sélectionnés (relation de sélection)
export const SELECTED_USER_HASH = "selectedUser";

export const WAITLIST_FIGHT_HASH = "waitingQueueFight";

export const NOTIFY_CONVERSATION_HISTORY_EVENT= "notifyConversationHistory";

export const NOTIFY_NOT_ENOUGH_CARD_EVENT= "notifyNotEnoughCard";

export const NOTIFY_ROOM_FIGHT_CREATED_EVENT= "notifyRoomFightCreated";

export const NOTIFY_ROOM_PLAY_CANCEL= "notifyPlayError";

export const NOTIFY_ATTACK_RESPONSE= "attackResponse";

export const NOTIFY_END_FIGHT= "endFight";

export const TYPE_ROOM = {
    CHAT: "chat",
    FIGHT: "fight",
};

// Hash pour stocker les games en cours
export const GAME_HASH = "game";

