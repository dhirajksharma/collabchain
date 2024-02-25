const express = require("express");
const {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  removeParticipantFromGroupChat,
}=require("../controllers/chatController.js")
const {isAuthenticatedUser} = require("../middleware/auth.js")
const router = express.Router();
router.use(isAuthenticatedUser);

router.route("/")
  .get(getAllChats);

router.route("/c/:receiverId")
  .post(createOrGetAOneOnOneChat);

router.route("/group")
  .post(createAGroupChat);

router.route("/group/:projectId")
  .get(getGroupChatDetails)

router.route("/group/:chatId/:participantId")
  .post(addNewParticipantInGroupChat)
  .delete(removeParticipantFromGroupChat);

module.exports=router;
