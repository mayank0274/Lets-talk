const { Server } = require("socket.io");
const User = require("./models/user");

const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_BASE_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("user_connected", async (data) => {
      if (!data) return;
      socket.join(`user_${data._id}`);
    });

    socket.on("create_room", (chat) => {
      socket.join(`chat_${chat._id}`);
    });

    socket.on("new_message", (message) => {
      message.receiver.forEach((receiver) => {
        socket.in(`user_${receiver}`).emit("send_received_message", message);
      });
    });

    socket.on("disconnection", () => {
      console.log("Disconnect");
    });
  });
};

module.exports = socketConnection;
