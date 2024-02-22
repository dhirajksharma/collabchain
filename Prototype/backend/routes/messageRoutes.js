const express = require("express");
const {getAllMessages, sendMessage} = require("../controllers/messageController.js")
const {isAuthenticatedUser} = require("../middleware/auth.js")
const router = express.Router();
router.use(isAuthenticatedUser);

router.route("/:chatId")
  .get(getAllMessages) //get all the messages of a particular chat
  .post(sendMessage); //add new messages to the chat

module.exports = router;
