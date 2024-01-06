const { Server } = require("socket.io");

const io = new Server(8000, { cors: true });

const roomToSocketMap = new Map();
const socketToRoomMap = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    roomToSocketMap.set(data.roomId, socket.id);
    socketToRoomMap.set(socket.id, data.roomId);
    io.to(data.roomId).emit("user:joined", {
      username: data.username,
      roomId: data.roomId,
      id: socket.id,
    });
    socket.join(data.roomId);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:code", (data) => {
    io.to(data.roomId).emit("user:code", data);
  });
});
