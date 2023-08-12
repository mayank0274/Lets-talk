const Joi = require("joi");
const Chat = require("../../models/chat");

const renameGroupController = async (req, res, next) => {
  // validate credentials
  const validationSchema = Joi.object({
    grpId: Joi.string().required(),
    newName: Joi.string().required(),
  });

  try {
    const error = await validationSchema.validateAsync(req.body);
  } catch (err) {
    return next(err);
  }

  // find chat and upadate
  const { grpId, newName } = req.body;

  try {
    const myGroup = await Chat.findOne({
      _id: grpId,
      isGroupChat: true,
    });

    if (!myGroup) {
      return next(CustomErrorHandler.resourceNotExist("Group not found"));
    }

    const updateDetails = await Chat.findOneAndUpdate(
      {
        _id: grpId,
        isGroupChat: true,
      },
      {
        $set: {
          name: newName,
        },
      },
      { new: true }
    ).populate("members", "name email profilePic userName");

    return res
      .status(200)
      .json({ message: "Group renamed successfully", chat: updateDetails });
  } catch (err) {
    return next(err);
  }
};

module.exports = renameGroupController;
