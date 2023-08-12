const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/customErrorHandler");
const jwtservice = require("../../services/jwtservice");
const sendEmail = require("../../services/emailService");
const bcrypt = require("bcryptjs");

// forgot password email
const sendForgotPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
  });

  // validate email
  try {
    const { error } = await validationSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    return next(err);
  }

  try {
    // find user and send email

    const user = await User.findOne({
      email,
    });

    // if user not exist or not verified send error
    if (!user || !user.isVerified) {
      return next(CustomErrorHandler.resourceNotExist("User not found"));
    }

    // if found and verified send email
    const forgotPasswordURL = `${process.env.FRONTEND_BASE_URL}/forgotPassword/${user._id}`;
    sendEmail(
      email,
      "Reset Password - Let's Talk",
      forgotPasswordURL,
      "resetPwd"
    );

    return res.status(200).json({
      message: "Password reset instructions sent to your email",
    });
  } catch (error) {
    return next(error);
  }
};

// reset passwprd function

const resetPassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const userId = req.params.id;

  if (!userId) {
    return next(
      CustomErrorHandler.resourceNotExist("All credentials are required")
    );
  }

  const validationSchema = Joi.object({
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/m)
      .required(),
    confirmPassword: Joi.string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/m)
      .required(),
  });

  // validate credentials
  try {
    const { error } = await validationSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    return next(err);
  }

  try {
    if (password != confirmPassword) {
      return next(CustomErrorHandler.passwordNotMatch("Password not match"));
    }

    // find user
    const user = await User.findOne({
      _id: userId,
    });

    // if user not exist or not verified send error
    if (!user || !user.isVerified) {
      return next(CustomErrorHandler.resourceNotExist("User not found"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  sendForgotPasswordEmail,
  resetPassword,
};
