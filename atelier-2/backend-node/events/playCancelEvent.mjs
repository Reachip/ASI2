export const playCancelEvent = async (redis, io, data) => {
    try {
        const { id } = data;
        console.log(`Utilisateur ${id} a annulé son jeu`);
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes de l'utilisateur :", error.message);
        throw error;
    }
}