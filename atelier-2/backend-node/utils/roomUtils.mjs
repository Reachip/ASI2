export const roomExists = (io, roomId) => {
    return io.sockets.adapter.rooms.has(roomId);
};

export const deleteRoom = (io, roomId) => {
    if (roomExists(io, roomId)) {
        const room = io.sockets.adapter.rooms.get(roomId);
        room.forEach((socketId) => {
            io.sockets.sockets.get(socketId).leave(roomId);
        });
        console.log(`Room ${roomId} deleted.`);
    }
};

export const createRoom = (io, type, userId1, userId2, userSocket1, userSocket2 ) => {
    // Crée un identifiant de room unique basé sur les IDs des deux utilisateurs
    const roomId = `${type}_room_${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;

    if (!roomExists(io, roomId)) {
        // Ajoute les utilisateurs dans cette room
        userSocket1.join(roomId);
        userSocket2.join(roomId);

        console.log(`Room ${roomId} Created.`);
    }
    return roomId;
};