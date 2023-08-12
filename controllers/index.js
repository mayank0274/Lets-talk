const registrationController = require("./auth/registrationController");
const verifyAccountController = require("./auth/verifyAccountController");
const loginController = require("./auth/loginController");
const logoutController = require("./auth/logoutController");
const {
  sendForgotPasswordEmail,
  resetPassword,
} = require("./auth/forgotPasswordController");
const getUserDetailsController = require("./auth/getUserDetailsController");
const searchUserController = require("./chat/searchUserController");
const createChatController = require("./chat/createChatController");
const getAllChatsController = require("./chat/getAllChatsController");
const renameGroupController = require("./chat/renameGroupController");
const removeGroupMemberController = require("./chat/removeGroupMemberController");
const addGroupMemberController = require("./chat/addGroupMemberController");
const leaveGroupController = require("./chat/leaveGroupController");
const sendMessageController = require("./messages/sendMessageController");
const getAllMessagesController = require("./messages/getAllMessagesController");

module.exports = {
  registrationController,
  verifyAccountController,
  loginController,
  logoutController,
  getUserDetailsController,
  sendForgotPasswordEmail,
  resetPassword,
  searchUserController,
  createChatController,
  getAllChatsController,
  renameGroupController,
  removeGroupMemberController,
  addGroupMemberController,
  leaveGroupController,
  sendMessageController,
  getAllMessagesController,
};
