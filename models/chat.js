const mongoose = require("mongoose");

// schema for chats of a user => schema for chats between users
const chatSchema = mongoose.Schema({
  name: { //name will be receiver name in one 2 one chats 
    type: String,
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  ],
  isGroupChat: {
    type: Boolean,
    default: false
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);