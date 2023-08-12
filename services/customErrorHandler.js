class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.statusCode = status;
    this.errorMsg = message;
  }

  static credentialsAlreadyTaken(message) {
    return new CustomErrorHandler(409, message);
  }

  static passwordNotMatch(message) {
    return new CustomErrorHandler(409, message);
  }

  static groupMembersLengthNotSufficient(message) {
    return new CustomErrorHandler(422, message);
  }

  static resourceNotExist(message) {
    return new CustomErrorHandler(404, message);
  }

  static userAlreadyVerified(message) {
    return new CustomErrorHandler(409, message);
  }

  static accessDenied(message) {
    return new CustomErrorHandler(403, message);
  }

  static credentialsRequired(message) {
    return new CustomErrorHandler(404, message);
  }
}

module.exports = CustomErrorHandler;
