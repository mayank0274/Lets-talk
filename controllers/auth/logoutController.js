const logoutController = (req, res, next) => {
  try {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "logout success" });
  } catch (error) {
    return next(error);
  }
};

module.exports = logoutController;
