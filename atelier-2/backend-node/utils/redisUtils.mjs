import {CONNECTED_USERS_HASH, SELECTED_USER_HASH, USER_ROOMS_HASH, WAITLIST_FIGHT_HASH} from "./constants.mjs";

export const addInRedis = async (redis, hash, key, value) => {
    try {
        // Récupérer la valeur actuelle
        let valueOfKey = await redis.hget(hash, key);
        console.log(`Valeur de ${hash} pour ${key}: ${valueOfKey}`);

        // Initialiser avec une liste vide si la clé n'existe pas encore
        let listValueOfKey = valueOfKey ? JSON.parse(valueOfKey) : [];

        // Ajouter la nouvelle valeur si elle n'existe pas déjà
        if (!listValueOfKey.includes(value)) {
            listValueOfKey.push(value);
            console.log(`Ajout de ${value} dans ${hash} pour ${key}`);

            // Mettre à jour Redis avec la liste modifiée
            await redis.hset(hash, key, JSON.stringify(listValueOfKey));
            console.log(`Résultat après ajout: ${hash}, ${key}: ${JSON.stringify(listValueOfKey)}`);
        } else {
            console.log(`${value} existe déjà dans ${hash} pour ${key}`);
        }
    } catch (error) {
        console.error(`Erreur lors de l'ajout de ${value} dans ${hash} pour ${key}:`, error);
    }
};

export const deleteInRedis = async (redis, hash, key, value) => {
    try {
        let valueOfKey = await redis.hget(hash, key);
        console.log(`Valeur de ${hash} pour ${key}: ${valueOfKey}`);

        if (valueOfKey) {
            let listValueOfKey = JSON.parse(valueOfKey);

            // Vérifie si `value` est dans la liste
            if (listValueOfKey.includes(value)) {
                // Supprime `value` de la liste
                listValueOfKey = listValueOfKey.filter(id => id !== value);
                console.log(`Suppression de ${value} dans ${hash} pour ${key}`);

                // Si la liste est vide, supprime la clé
                if (listValueOfKey.length === 0) {
                    await redis.hdel(hash, key);
                    console.log(`Suppression de la clé ${key} car la liste est vide.`);
                } else {
                    // Sinon, met à jour la liste dans Redis
                    await redis.hset(hash, key, JSON.stringify(listValueOfKey));
                    console.log(`Résultat après suppression : ${hash}, ${key}: ${JSON.stringify(listValueOfKey)}`);
                }
            }
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression dans ${hash} pour ${key}:`, error);
    }
};

export const existsInRedis = async (redis, hash, key, value) => {
    try {
        // Récupère la valeur associée à la clé dans le hash
        const valueOfKey = await redis.hget(hash, key);
        console.log(`Valeur actuelle de ${hash} pour ${key}: ${valueOfKey}`);

        // Si la clé n'existe pas ou est vide, retourne `false`
        if (!valueOfKey) {
            return false;
        }

        // Parse la liste JSON et vérifie la présence de la valeur
        const listValueOfKey = JSON.parse(valueOfKey);
        const exists = listValueOfKey.includes(value);

        console.log(`La valeur ${value} ${exists ? "existe" : "n'existe pas"} dans ${hash} pour ${key}`);
        return exists;
    } catch (error) {
        console.error(`Erreur lors de la vérification dans ${hash} pour ${key}:`, error);
        return false;
    }
};

export const getListFromRedis = async (redis, hash, key) => {
    try {
        // Récupère la valeur associée à la clé dans le hash
        const valueOfKey = await redis.hget(hash, key);
        console.log(` getListFromRedis : Valeur de ${hash} pour ${key}: ${valueOfKey}`);

        // Si la clé n'existe pas, retourne une liste vide
        if (!valueOfKey) {
            return [];
        }

        // Parse la valeur JSON et retourne comme liste
        const parsedValue = JSON.parse(valueOfKey);
        console.log(` getListFromRedis : parsedValue de ${parsedValue} `);
        console.log(`is Array ? ${Array.isArray(parsedValue)}`);
        return parsedValue;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la liste dans ${hash} pour ${key}:`, error);
        return []; // En cas d'erreur, retourne une liste vide
    }
};

export const getDetailsUserById = async (redis, id) => {
    return JSON.parse(await redis.hget(CONNECTED_USERS_HASH, id));
}

export const logDetailsRedis = async (io,redis)=>{
    console.log("Nombre d'utilisateurs connectés :",await redis.hlen(CONNECTED_USERS_HASH));
    console.log(`Nombre de rooms actives : ${io.sockets.adapter.rooms.size}`);
};

/**
 * Initializes the server by clearing specific Redis keys and resetting counters.
 *
 * @async
 * @function initServer
 * @param {Object} io - The Socket.IO server instance for emitting events.
 * @param {Object} redis - The Redis client instance used for interacting with the database.
 * @returns {Promise<void>} Resolves when the server initialization is complete.
 */
export async function initServer(io, redis) {
    await redis.del(WAITLIST_FIGHT_HASH);
    await redis.set("userCounter", 0);
    await redis.del(CONNECTED_USERS_HASH);
    await redis.del(SELECTED_USER_HASH);
    await redis.del(USER_ROOMS_HASH);

    // Log details from Redis
    await logDetailsRedis(io, redis);

    console.log("init Server completed");
}
