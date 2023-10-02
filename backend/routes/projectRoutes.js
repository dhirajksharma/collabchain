const express=require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/projects")
    .get(isAuthenticatedUser,getAllProjects) //users gets all the projects on public feed
    .post(isAuthenticatedUser,authorizeRoles("Mentor"),createProject) //mentor creates a new project

router.route("/projects/:id")
    .get(isAuthenticatedUser,getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(isAuthenticatedUser,authorizeRoles("Mentor"),editProject) //mentor edits his project details

router.route("/projects/:id/apply")
    .post(isAuthenticatedUser,applyToProject) //users applying to a project
    .delete(isAuthenticatedUser,withdrawApplication) //users withdrawing their application

router.route("/projects/:id/mytasks")
    .get(isAuthenticatedUser,getAssignedTasks) //selected mentees get their assigned tasks

router.route("/projects/:id/tasks/:id")
    .post(isAuthenticatedUser,uploadTaskWork) //selected mentees upload their work

module.exports=router;