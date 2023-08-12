const Message = require("../../models/message");
const Chat = require("../../models/chat");
const CustomErrorHandler = require("../../services/customErrorHandler");

const sendMessageController = async (req, res, next) => {
  const { chatId, message, size, isMedia, resourceType } = req.body;

  if (!chatId || !message) {
    return next(
      CustomErrorHandler.credentialsRequired("chat jd or message required")
    );
  }

  try {
    const chat = await Chat.findOne({
      _id: chatId,
    });

    // if chat not found return error
    if (!chat) {
      return next(CustomErrorHandler.resourceNotExist("chat not found"));
    }
    const receiver = chat.members.filter((elem) => {
      return elem._id != req.user._id;
    });
    // if if content is some media or not => check if message received is url or not
    // const isMedia = /^https?:\/\/([\w\d\-]+\.)+\w{2,}(\/.+)?$/.test(message);

    // create a new message
    let newMessage = await new Message({
      sender: req.user._id,
      receiver,
      chatId,
      content: message,
      isMedia,
      size,
      resourceType,
    }).populate("sender", "name profilePic");

    newMessage = await Chat.populate(newMessage, {
      path: "chatId",
    });

    let saveMessage = await newMessage.save();

    // add this message to last message of this chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: saveMessage,
    });

    return res.status(200).json({ message: saveMessage });
  } catch (err) {
    next(err);
  }
};

module.exports = sendMessageController;
