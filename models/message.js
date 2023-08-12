const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      // url/path of media in case if message is some media otherwise text message content
      type: String,
      required: true,
    },
    isMedia: {
      type: Boolean,
      default: false,
    },
    resourceType: {
      // only for media
      type: String,
    },
    size: {
      // only for media
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messagesSchema);
