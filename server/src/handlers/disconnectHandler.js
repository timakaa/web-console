export const handleDisconnect = (socket, io, roomManager) => {
  console.log("Client disconnected:", socket.id);

  const result = roomManager.findRoomBySocket(socket.id);
  if (!result) return;

  const { roomCode, room } = result;

  if (room.screen === socket.id) {
    // Screen disconnected, notify controllers and delete room
    io.to(roomCode).emit("screen-disconnected");
    roomManager.deleteRoom(roomCode);
    console.log(`Room ${roomCode} deleted (screen disconnected)`);
  } else {
    // Remove controller from room
    const removeResult = roomManager.removeController(roomCode, socket.id);
    if (removeResult.removed) {
      console.log(
        `Emitting controller-left to screen ${removeResult.screenSocketId}`,
      );
      io.to(removeResult.screenSocketId).emit("controller-left", {
        controllerId: socket.id,
        totalControllers: removeResult.remainingControllers,
      });
      console.log(
        `Remaining controllers in ${roomCode}:`,
        removeResult.remainingControllers,
      );

      // If no controllers left AND room is in game mode, notify screen to close
      if (removeResult.remainingControllers === 0 && room.inGame) {
        console.log(
          `No controllers left in game room ${roomCode}, closing room`,
        );
        io.to(removeResult.screenSocketId).emit("room-empty");
        // Delete room after a short delay to allow screen to handle the event
        setTimeout(() => {
          roomManager.deleteRoom(roomCode);
          console.log(`Room ${roomCode} deleted (no controllers)`);
        }, 1000);
      }
    }
  }
};
