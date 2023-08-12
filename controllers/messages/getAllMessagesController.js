const Message = require("../../models/message");
const Chat = require("../../models/chat");
const CustomErrorHandler = require("../../services/customErrorHandler");

const getAllMessagesController = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
    });

    // if chat not found return error
    if (!chat) {
      return next(CustomErrorHandler.resourceNotExist("chat not found"));
    }

    // find messages and send them
    let messages = await Message.find({
      chatId: req.params.chatId,
    }).populate("sender", "name profilePic");

    messages = await Chat.populate(messages, {
      path: "chatId",
    });

    return res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllMessagesController;
