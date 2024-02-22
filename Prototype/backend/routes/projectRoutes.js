const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { addTaskContributor, removeTaskContributor, getAllProjects, createProject, getProjectDetails, editProject, applyToProject, withdrawApplication, updateMenteeStatus, addTask, uploadTaskWork, getAssignedTasks, markTaskComplete } = require("../controllers/projectController");
const router = express.Router();
router.use(isAuthenticatedUser);

router.route("/projects")
    .get(getAllProjects) //users gets all the projects on public feed
    .post(authorizeRoles("mentor"), createProject) //mentor creates a new project

router.route("/projects/:projectid")
    .get(getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(authorizeRoles("mentor"), editProject) //mentor edits his project details

router.route("/projects/:projectid/apply")
    .post(applyToProject) //users applying to a project
    .delete(withdrawApplication) //users withdrawing their application

router.route("/projects/:projectid/updatementeestatus")
    .post(authorizeRoles("mentor"), updateMenteeStatus) //mentor updates mentee status of applicants

router.route("/projects/:projectid/tasks")
    .post(authorizeRoles("mentor"), addTask) //mentor adds new task to the project

router.route("/projects/:projectid/tasks/:taskid")
    .post(authorizeRoles("mentor"), addTaskContributor) //add contributors to the task
    .delete(authorizeRoles("mentor"), removeTaskContributor) //remove contributor from the task
    .put(authorizeRoles("mentee"), uploadTaskWork) //selected mentees upload their work

router.route("/projects/:projectid/mytasks")
    .get(getAssignedTasks) //selected mentees get their assigned tasks

router.route("/projects/:projectid/tasks/:taskid/markcomplete")
    .post(authorizeRoles("mentor"), markTaskComplete) //mentor marks the task complete with key

module.exports = router;