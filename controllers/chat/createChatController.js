const Chat = require("../../models/chat");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const CustomErrorHandler = require("../../services/customErrorHandler");
const User = require("../../models/user");

// const findNameById = async (id) => {
//   const user = await User.findOne({ _id: id });
//   return user.name;
// };

// controller for creating chat between users
const createChatController = async (req, res, next) => {
  const { userIds, groupName } = req.body;

  // throw error if userIds not received
  if (!userIds) {
    return next(
      CustomErrorHandler.credentialsRequired("Member user id's are required")
    );
  }

  // find a chat if alredy exists
  let chatMembers = [req.user._id, ...userIds];

  // cast id string to object id
  chatMembers = chatMembers.map((elem) => {
    return new ObjectId(elem.toString().trim());
  });

  // if only one userId received then it is one 2 one chat otherwise groupchat
  const isGroupChat = userIds.length == 1 ? false : true;

  if (isGroupChat && chatMembers.length < 3) {
    return next(
      CustomErrorHandler.groupMembersLengthNotSufficient(
        "Group must have 3 members including admin"
      )
    );
  }

  try {
    let chat = await Chat.findOne({
      members: { $all: chatMembers },
      isGroupChat,
    })
      .populate("members", "-password")
      .populate("latestMessage");

    // also populate latest message sender details
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name email profilePic userName",
    });

    if (chat) {
      if (chat.isGroupChat) {
        chat = await chat.populate("groupAdmin", "-password");
      }
      return res.status(200).json({ chat });
    }

    // if chat not exist then create it

    // check wheter groupName received or not

    if (isGroupChat && !groupName) {
      return next(
        CustomErrorHandler.credentialsRequired("Group name is required")
      );
    }

    // const chatName = await findNameById(userIds[0]);

    let myChat = await new Chat({
      name: isGroupChat && groupName ? groupName : "chat",
      members: chatMembers,
      isGroupChat,
      ...(isGroupChat && { groupAdmin: req.user._id }),
    }).populate("members", "-password");

    if (isGroupChat) {
      myChat = await myChat.populate("groupAdmin", "-password");
    }

    const saveCreatedChat = await myChat.save();

    return res.status(200).json({ chat: saveCreatedChat });
  } catch (err) {
    next(err);
  }
};

module.exports = createChatController;
