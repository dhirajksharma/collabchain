const mongoose=require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    content:{
        type: String,
    },
    chat:{
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
    },
},{timestamps:true});
  
module.exports = mongoose.model("ChatMessage", chatMessageSchema);