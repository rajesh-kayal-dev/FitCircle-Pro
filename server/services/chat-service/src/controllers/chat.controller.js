import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;

  const conversationId =
    userId < otherUserId
      ? `${userId}_${otherUserId}`
      : `${otherUserId}_${userId}`;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 });

  res.json(messages);
};