const Chat = require("../../models/chat");
const CustomErrorHandler = require("../../services/customErrorHandler");

const leaveGroupController = async (req, res, next) => {
  const { grpId } = req.body;

  if (!grpId) {
    return next(CustomErrorHandler.credentialsRequired("Group id is required"));
  }

  try {
    let chat = await Chat.findOne({
      _id: grpId,
      isGroupChat: true,
    });

    // if chat not found throw error
    if (!chat) {
      return next(CustomErrorHandler.resourceNotExist("group not exist"));
    }

    // check of user is member of group or not
    chat = await Chat.findOne({
      _id: grpId,
      isGroupChat: true,
      members: req.user._id,
    });

    if (!chat) {
      return next(
        CustomErrorHandler.resourceNotExist(
          "Requested user is not a member of group"
        )
      );
    }

    // if the user who wants to exit is admin itself then make another member as admin otherwise simply remove user

    const isGroupAdmin = req.user._id == chat.groupAdmin ? true : false;

    const updateDetails = await Chat.findOneAndUpdate(
      {
        _id: grpId,
        isGroupChat: true,
      },
      {
        $pull: { members: req.user._id },
        ...(isGroupAdmin && {
          groupAdmin: chat.members[1]
            ? chat.members[1]
            : chat.members[0]
            ? chat.members[0]
            : null,
        }),
      },
      {
        new: true,
      }
    ).populate("members", "name email profilePic userName");

    return res
      .status(200)
      .json({ message: "You left group successfully", chat: updateDetails });
  } catch (err) {
    return next(err);
  }
};

module.exports = leaveGroupController;
