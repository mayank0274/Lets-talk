const CustomErrorHandler = require("../services/customErrorHandler");
const jwtService = require("../services/jwtservice");

const verifyUser = async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(CustomErrorHandler.accessDenied("Access denied"));
  }

  try {
    const verifyJWT = await jwtService.verify(access_token);

    if (!verifyJWT.isVerified) {
      return next(CustomErrorHandler.accessDenied("User not verified"));
    }

    const user = {
      _id: verifyJWT.id,
    };
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyUser;
