const Chat = require("../../models/chat");

const getAllChatsController = async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate("latestMessage")
      .populate("members", "name email profilePic userName");

    return res.status(200).json({ chats });
  } catch (err) {
    return next(err);
  }
};

module.exports = getAllChatsController;
