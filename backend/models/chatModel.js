const mongoose=require("mongoose");

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: "Project",
        default: null
    },
    lastMessage: {
        type: mongoose.Schema.ObjectId,
        ref: "ChatMessage",
    },
    participants: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
},{ timestamps: true });
  
module.exports = mongoose.model("Chat", chatSchema);