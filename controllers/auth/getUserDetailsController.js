const User = require("../../models/user");
const CustomErrorHandler = require("../../services/customErrorHandler");

const getUserDetailsController = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select(
      "-password -updatedAt -__v"
    );
    if(!user) {
      return next(CustomErrorHandler.resourceNotExist("User not found"));
    }
    res.status(200).json({ user });
  } catch(err) {
    return next(err);
  }
}

module.exports = getUserDetailsController;