const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route('/createTask/:taskId')
    .post(isAuthenticatedUser, authorizeRoles('Mentor'), createTask);

router.route('/assignUser/:taskId/:userAddress')
    .post(isAuthenticatedUser, authorizeRoles('Mentor'),assignUser);

router.route('/checkTaskStatus/:taskId')
    .get(isAuthenticatedUser, authorizeRoles('Mentor'),checkTaskStatus);
