const express = require("express");
const { isAuthenticatedUser} = require("../middleware/auth");
const { addTaskContributor, removeTaskContributor, getAllProjects, createProject, getProjectDetails, editProject, applyToProject, withdrawApplication, updateMenteeStatus, addTask, uploadTaskWork, getAssignedTasks, markTaskComplete } = require("../controllers/projectController");
const router = express.Router();
router.use(isAuthenticatedUser);

router.route("/")
    .get(getAllProjects) //users gets all the projects on public feed
    .post(createProject) //mentor creates a new project

router.route("/:projectid")
    .get(getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(editProject) //mentor edits his project details

router.route("/:projectid/apply")
    .post(applyToProject) //users applying to a project
    .delete(withdrawApplication) //users withdrawing their application

router.route("/:projectid/updatementeestatus")
    .post(updateMenteeStatus) //mentor updates mentee status of applicants

router.route("/:projectid/tasks")
    .post(addTask) //mentor adds new task to the project

router.route("/:projectid/tasks/:taskid")
    .post(addTaskContributor) //add contributors to the task
    .delete(removeTaskContributor) //remove contributor from the task
    .put(uploadTaskWork) //selected mentees upload their work

router.route("/:projectid/mytasks")
    .get(getAssignedTasks) //selected mentees get their assigned tasks

router.route("/:projectid/tasks/:taskid/markcomplete")
    .post(markTaskComplete) //mentor marks the task complete with key

module.exports = router;