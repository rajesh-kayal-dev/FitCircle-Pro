import Message from "../models/Message.js";

const users = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // join
    socket.on("join", (userId) => {
      users[userId] = socket.id;
      console.log("User joined:", userId);
    });

    // send message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      const conversationId =
        senderId < receiverId
          ? `${senderId}_${receiverId}`
          : `${receiverId}_${senderId}`;

      const message = await Message.create({
        senderId,
        receiverId,
        text,
        conversationId,
      });

      // send to receiver
      const receiverSocket = users[receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);
      }

      // send back to sender
      socket.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      for (let key in users) {
        if (users[key] === socket.id) {
          delete users[key];
        }
      }
    });
  });
};

export default socketHandler;