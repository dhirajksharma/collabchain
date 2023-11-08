const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { addTaskContributor, removeTaskContributor, getAllProjects, createProject, getProjectDetails, editProject, applyToProject, withdrawApplication, updateMenteeStatus, addTask, uploadTaskWork, getAssignedTasks, markTaskComplete } = require("../controllers/projectController");
const router = express.Router();

router.route("/projects")
    .get(isAuthenticatedUser, getAllProjects) //users gets all the projects on public feed
    .post(isAuthenticatedUser, createProject) //mentor creates a new project

router.route("/projects/:projectid")
    .get(isAuthenticatedUser, getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(isAuthenticatedUser, editProject) //mentor edits his project details

router.route("/projects/:projectid/apply")
    .post(isAuthenticatedUser, applyToProject) //users applying to a project
    .delete(isAuthenticatedUser, withdrawApplication) //users withdrawing their application

router.route("/projects/:projectid/updateMenteeStatus")
    .push(isAuthenticatedUser, updateMenteeStatus) //mentor updates mentee status of applicants

router.route("/projects/:projectid/tasks")
    .post(isAuthenticatedUser, addTask) //mentor adds new task to the project

router.route("/projects/:projectid/tasks/:taskid")
    .post(isAuthenticatedUser, addTaskContributor) //add contributors to the task
    .delete(isAuthenticatedUser, removeTaskContributor) //remove contributor from the task
    .put(isAuthenticatedUser, isAuthenticatedUser, uploadTaskWork) //selected mentees upload their work

router.route("/projects/:projectid/mytasks")
    .get(isAuthenticatedUser, isAuthenticatedUser, getAssignedTasks) //selected mentees get their assigned tasks

router.route("/projects/:projectid/tasks/:taskid/markComplete")
    .post(isAuthenticatedUser, markTaskComplete) //mentor marks the task complete with key

module.exports = router;