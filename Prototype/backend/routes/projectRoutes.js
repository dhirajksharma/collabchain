const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { addTaskContributor, removeTaskContributor, getAllProjects, createProject, getProjectDetails, editProject, applyToProject, withdrawApplication, updateMenteeStatus, addTask, uploadTaskWork, getAssignedTasks, markTaskComplete } = require("../controllers/projectController");
const router = express.Router();

router.route("/projects")
    .get(isAuthenticatedUser, getAllProjects) //users gets all the projects on public feed
    .post(isAuthenticatedUser, authorizeRoles("mentor"), createProject) //mentor creates a new project

router.route("/projects/:projectid")
    .get(isAuthenticatedUser, getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(isAuthenticatedUser, authorizeRoles("mentor"), editProject) //mentor edits his project details

router.route("/projects/:projectid/apply")
    .post(isAuthenticatedUser, applyToProject) //users applying to a project
    .delete(isAuthenticatedUser, withdrawApplication) //users withdrawing their application

router.route("/projects/:projectid/updatementeestatus")
    .post(isAuthenticatedUser, authorizeRoles("mentor"), updateMenteeStatus) //mentor updates mentee status of applicants

router.route("/projects/:projectid/tasks")
    .post(isAuthenticatedUser, authorizeRoles("mentor"), addTask) //mentor adds new task to the project

router.route("/projects/:projectid/tasks/:taskid")
    .post(isAuthenticatedUser, authorizeRoles("mentor"), addTaskContributor) //add contributors to the task
    .delete(isAuthenticatedUser, authorizeRoles("mentor"), removeTaskContributor) //remove contributor from the task
    .put(isAuthenticatedUser, authorizeRoles("mentee"), uploadTaskWork) //selected mentees upload their work

router.route("/projects/:projectid/mytasks")
    .get(isAuthenticatedUser, getAssignedTasks) //selected mentees get their assigned tasks

router.route("/projects/:projectid/tasks/:taskid/markcomplete")
    .post(isAuthenticatedUser, authorizeRoles("mentor"), markTaskComplete) //mentor marks the task complete with key

module.exports = router;