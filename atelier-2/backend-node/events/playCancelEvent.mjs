import RetryPlayQueue from "../service/RetryPlayQueue.mjs";

export const playCancelEvent = async (redis, io, data) => {
    try {
        const { id } = data;
        console.log(`Utilisateur ${id} a annulé son jeu`);

        const retryPlayQueue = new RetryPlayQueue(redis, id)
        await retryPlayQueue.delete()
    } catch (error) {
        console.error("Erreur lors de l'annulation du jeu de l'utilisateur :", error.message);
        throw error;
    }
}
