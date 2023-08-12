const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/customErrorHandler");
const jwtservice = require("../../services/jwtservice");
const sendEmail = require("../../services/emailService");
const bcrypt = require("bcryptjs");

const registrationController = async (req, res, next) => {
  // credentials validation
  const validationSchema = Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().min(5).required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/m)
      .required(),
    email: Joi.string().email().required(),
    profilePic: Joi.string(),
  });

  try {
    const { error } = await validationSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    next(err);
  }

  // checking if user already exists or not
  const { name, userName, email, password, profilePic } = req.body;

  try {
    let user = await User.findOne({ email });

    // if user already registered and not verified send vefification email
    if (user && !user.isVerified) {
      sendEmail(
        user.email,
        "Verify your account",
        `${process.env.APP_BASE_URL}/api/auth/verify/${user._id}`,
        "registration"
      );
      return res.status(200).json({
        message: "Registration success check your email to verify your account",
      });
    }

    if (user) {
      return next(
        CustomErrorHandler.credentialsAlreadyTaken("Email already taken")
      );
    }

    user = await User.findOne({ userName });

    if (user) {
      return next(
        CustomErrorHandler.credentialsAlreadyTaken("Username already taken")
      );
    }
  } catch (err) {
    next(err);
  }
  // register user if not exist
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const userDetails = await new User({
      name,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      ...(profilePic != "" && { profilePic }),
    });

    const saveUser = await userDetails.save();
    const verificationLink = `${process.env.APP_BASE_URL}/api/auth/verify/${saveUser._id}`;

    sendEmail(
      saveUser.email,
      "Verify your account",
      verificationLink,
      "registration"
    );
    //const token = jwtservice().sign({_id:saveUser._id});

    return res.status(200).json({
      message: "Registration success check your email to verify your account",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = registrationController;
