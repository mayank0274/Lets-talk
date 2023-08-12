const User = require("../../models/user");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const searchUserController = async (req, res, next) => {
  const searchParameter = req.query.search;

  try {
    let searchResults;
    const isEmail = validateEmail(searchParameter);

    // if search query is email then find by email
    if (isEmail) {
      searchResults = await User.find({
        email: searchParameter,
        isVerified: true,
      }).find({ _id: { $ne: req.user._id } });
    } else {
      searchResults = await User.find({
        $or: [
          {
            name: { $regex: searchParameter, $options: "i" },
            isVerified: true,
          },
          {
            userName: { $regex: searchParameter, $options: "i" },
            isVerified: true,
          },
        ],
      })
        .find({ _id: { $ne: req.user._id } })
        .select("-password");
    }

    return res.status(200).json({ users: searchResults });
  } catch (err) {
    next(err);
  }
};

module.exports = searchUserController;
