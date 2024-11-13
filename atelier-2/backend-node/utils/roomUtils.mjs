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