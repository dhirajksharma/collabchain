const express=require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/projects")
    .get() //users gets all the projects on public dashboard
    .post() //mentor creates a new project

router.route("/projects/:id")
    .get() //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post() //mentor edits his project details

router.route("/projects/:id/apply")
    .post() //users applying to a project
    .delete() //users withdrawing their application

router.route("/projects/:id/mytasks")
    .get() //selected mentees get their assigned tasks

router.route("/projects/:id/tasks/:id")
    .post() //selected mentees upload their work

module.exports=router;