const Joi = require("joi");
const CustomErrorHandler = require("../services/customErrorHandler");

const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let errorMsg = {
    message: "Internal server error",
    ...(process.env.DEBUG_MODE && { detailedError: error.message })
  }

  // if validation error occurred
  if(error instanceof Joi.ValidationError) {
    statusCode = 422;
    errorMsg = {
      message: error.message
    }
  };

  // if error is instance of customErrorHandler

  if(error instanceof CustomErrorHandler) {
    statusCode = error.statusCode;
    errorMsg = {
      message: error.errorMsg,
      ...(process.env.DEBUG_MODE && { detailedError: error.message })
    }
  }

  return res.status(statusCode).json(errorMsg);
}

module.exports = errorHandler;