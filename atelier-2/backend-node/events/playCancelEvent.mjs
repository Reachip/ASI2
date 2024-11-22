import { NOTIFY_ROOM_PLAY_CANCEL } from "../utils/constants.mjs";
import { notifyUser } from "./notifyEvent.mjs";

export const playCancelEvent = async (redis, io, data) => {
    try {
        const { id } = data;
        console.log(`Utilisateur ${id} a annulé son jeu`);

        const retryFlagKey = `retryFlag:${id}`;
        await redis.set(retryFlagKey, false);

        notifyUser(io, id, NOTIFY_ROOM_PLAY_CANCEL, { message: "Votre jeu a été annulé." });
    } catch (error) {
        console.error("Erreur lors de l'annulation du jeu de l'utilisateur :", error.message);
        throw error;
    }
}
