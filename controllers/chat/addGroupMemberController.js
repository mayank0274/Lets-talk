const Chat = require("../../models/chat");
const CustomErrorHandler = require("../../services/customErrorHandler");

const addGroupMemberController = async (req, res, next) => {
  const { grpId, userId } = req.body;

  if (!grpId || !userId) {
    return next(
      CustomErrorHandler.credentialsRequired("Group id or user id required")
    );
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

    // user is not group admin throw error
    if (chat.groupAdmin != req.user._id) {
      return next(
        CustomErrorHandler.accessDenied(
          "You are not authorized to do this action"
        )
      );
    }

    // if Requested user already member of group
    chat = await Chat.findOne({
      _id: grpId,
      isGroupChat: true,
      members: userId,
    });

    if (chat) {
      return next(
        CustomErrorHandler.credentialsAlreadyTaken(
          "Requested user is already a member of group"
        )
      );
    }

    // make changes only if user is group admin
    const updateDetails = await Chat.findOneAndUpdate(
      {
        _id: grpId,
        isGroupChat: true,
      },
      {
        $addToSet: { members: userId },
      },
      {
        new: true,
      }
    ).populate("members", "-password -isVerified");

    return res
      .status(200)
      .json({ message: "User added successfully", chat: updateDetails });
  } catch (err) {
    return next(err);
  }
};

module.exports = addGroupMemberController;
