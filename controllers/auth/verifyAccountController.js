const User = require("../../models/user");
const CustomErrorHandler = require("../../services/customErrorHandler");

const verifyAccountController = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw CustomErrorHandler.resourceNotExist("User not found");
    }

    if (user.isVerified) {
      throw CustomErrorHandler.userAlreadyVerified("User alredy verified");
    }

    const updatedCredentails = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isVerified: true,
        },
      }
    );

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    return next(err);
  }
};

module.exports = verifyAccountController;
