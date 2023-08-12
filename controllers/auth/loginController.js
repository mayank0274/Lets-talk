const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/customErrorHandler");
const jwtService = require("../../services/jwtservice");
const bcrypt = require("bcryptjs");

const loginController = async (req, res, next) => {
  const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    const error = await loginValidationSchema.validateAsync(req.body);
  } catch (err) {
    return next(err);
  }

  // check if user exist or not
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        CustomErrorHandler.resourceNotExist("Invalid login credentials")
      );
    }

    // compare password
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return next(
        CustomErrorHandler.resourceNotExist("Invalod login credentials")
      );
    }

    // check if verified or not
    if (!user.isVerified) {
      return next(CustomErrorHandler.accessDenied("User not verified"));
    }

    const token = jwtService.sign({
      id: user._id,
      isVerified: user.isVerified,
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Login successfully" });
  } catch (err) {
    return next(err);
  }
};

module.exports = loginController;
