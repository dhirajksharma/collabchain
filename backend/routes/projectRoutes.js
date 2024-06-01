const express = require("express");
const { isAuthenticatedUser} = require("../middleware/auth");
const { addTaskContributor, removeTaskContributor, getAllProjects, createProject, getProjectDetails, editProject, applyToProject, withdrawApplication, approveMenteeStatus, rejectMenteeStatus, addTask, uploadTaskWork, getAssignedTasks, reviewTask, saveProject, markTaskComplete, getTaskDocs, modifyTask } = require("../controllers/projectController");
const router = express.Router();
router.use(isAuthenticatedUser);

router.route("/")
    .get(getAllProjects) //users gets all the projects on public feed
    .post(createProject) //mentor creates a new project

router.route("/:projectid")
    .get(getProjectDetails) //users get project details (some details hidden based on type of user: public, mentor, mentee)
    .post(editProject) //mentor edits his project details
    .put(saveProject) //user saves project to his list

router.route("/:projectid/apply")
    .post(applyToProject) //users applying to a project
    .delete(withdrawApplication) //users withdrawing their application

router.route("/:projectid/updatementeestatus/:userid")
    .post(approveMenteeStatus) //mentor updates mentee status of applicants to approved
    .delete(rejectMenteeStatus) //mentor updates mentee status of applicants to removed

router.route("/:projectid/tasks")
    .post(addTask) //mentor adds new task to the project
    .put(modifyTask) //mentor modifies existing task
    
router.route("/:projectid/tasks/:taskid/reviewtask")
    .post(reviewTask) //mentor marks the task complete with key

router.route("/:projectid/tasks/:taskid/markTaskComplete")
    .post(markTaskComplete) //mentor marks the task complete with key

router.route("/:projectid/tasks/:taskid/:userid")
    .post(addTaskContributor) //add contributors to the task
    .delete(removeTaskContributor) //remove contributor from the task

router.route("/:projectid/tasks/:taskid")
    .put(uploadTaskWork) //selected mentees upload their work

router.route("/:projectid/mytasks")
    .get(getAssignedTasks) //selected mentees get their assigned tasks

router.route("/:projectid/tasks/:taskid/getDocs")
    .get(getTaskDocs) //mentor marks the task complete with key


module.exports = router;