const {
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
} = require("../controllers/index");

const verifyUser = require("../middlewares/verifyUser");

const appRoutes = (app) => {
  // auth routes
  app.post("/api/auth/register", registrationController);
  app.get("/api/auth/verify/:id", verifyAccountController);
  app.post("/api/auth/login", loginController);
  app.get("/api/auth/logout", verifyUser, logoutController);
  app.get("/api/auth/user", verifyUser, getUserDetailsController);
  app.post("/api/auth/forgotPasswordEmail", sendForgotPasswordEmail);
  app.patch("/api/auth/resetPassword/:id", resetPassword);

  // chat routes
  app.get("/api/chat/users", verifyUser, searchUserController);
  app.post("/api/chat/createChat", verifyUser, createChatController);
  app.get("/api/chat/getAllChats", verifyUser, getAllChatsController);
  app.patch("/api/chat/renameGroup", verifyUser, renameGroupController);
  app.patch("/api/chat/addMember", verifyUser, addGroupMemberController);
  app.patch("/api/chat/removeMember", verifyUser, removeGroupMemberController);
  app.patch("/api/chat/leftGroup", verifyUser, leaveGroupController);

  // messages routes
  app.post("/api/message", verifyUser, sendMessageController);
  app.get("/api/message/:chatId", verifyUser, getAllMessagesController);
};

module.exports = appRoutes;
