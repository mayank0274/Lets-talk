const jwt = require("jsonwebtoken");

const jwtService = {
  sign(payload, expiry = "1h", secret = process.env.JWT_SECRET) {
    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
  },

  verify(payload, secret = process.env.JWT_SECRET) {
    return jwt.verify(payload, secret);
  },
};

module.exports = jwtService;
