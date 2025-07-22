const { Message, User } = require("../models");

module.exports = (io, socket, onlineUsers) => {
  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      const { receiver_id, content } = data;
      
      // Save to database
      const message = await Message.create({
        sender_id: socket.user.id,
        receiver_id,
        content
      });
      
      // Populate sender info
      const newMessage = await Message.findByPk(message.id, {
        include: [{ 
          model: User, 
          as: "sender", 
          attributes: ["id", "name"] 
        }]
      });
      
      // Emit to sender
      socket.emit("new_message", newMessage);
      
      // Emit to receiver if online
      const receiverRoom = `user_${receiver_id}`;
      if (onlineUsers[receiver_id]) {
        io.to(receiverRoom).emit("new_message", newMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle read receipts
  socket.on("mark_read", async (senderId) => {
    try {
      await Message.update(
        { is_read: true },
        {
          where: {
            sender_id: senderId,
            receiver_id: socket.user.id,
            is_read: false
          }
        }
      );
      
      // Notify sender that messages were read
      const senderRoom = `user_${senderId}`;
      io.to(senderRoom).emit("message_read", {
        readerId: socket.user.id
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  // Handle typing indicators
  socket.on("typing", ({ receiver_id, isTyping }) => {
    const receiverRoom = `user_${receiver_id}`;
    io.to(receiverRoom).emit("typing", {
      sender_id: socket.user.id,
      isTyping
    });
  });
};