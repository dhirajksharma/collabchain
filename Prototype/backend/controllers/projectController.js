const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Project = require('../models/projectModels');
const User = require('../models/userModels');
const Task = require('../models/task');

// Get all projects on public feed
exports.getAllProjects = catchAsyncErrors(async (req, res) => {
  const publicProjects = await Project.find({ endDate: {$lt: new Date()} });
  res.json(publicProjects);
});

// Mentor creates a new project
exports.createProject = catchAsyncErrors(async (req, res) => {
  if (req.userType !== 'mentor') {
    return res.status(403).json({ message: 'Only mentors can create projects.' });
  }

  const mentor = req.user.id; // Assuming you have mentor authentication

  const project = await Project.create({ ...req.body, mentor });
  res.status(201).json(project);
});

// Users get project details (some details hidden based on user type: public, mentor, mentee)
exports.getProjectDetails = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  res.json(project);
});

// Mentor edits project details
exports.editProject = catchAsyncErrors(async (req, res) => {
  if (req.userType !== 'mentor') {
    return res.status(403).json({ message: 'Only mentors can edit projects.' });
  }

  const projectId = req.params.projectid;
  const { title, description, visibility } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { ...req.body },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  res.json(project);
});

// Users applying to a project
exports.applyToProject = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  // Implement your application logic here (e.g., add user to project's applicants list)
  project.mentesApplication.push(req.body);
  await project.save();

  res.status(200).json({ message: 'Application successful.' });
});

// Users withdrawing their application
exports.withdrawApplication = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  project.menteesApplication = project.menteesApplication.filter((application) => application.userId !== req.user.id);
  await project.save();

  res.status(200).json({ message: 'Withdrawal successful.' });
});

// Mentor updates mentee status
exports.updateMenteeStatus = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  let newMenteesList=req.body.menteesList;
  newMenteesList.forEach(application => {
    if(application.status==="approved")
      project.menteesApproved.push({
        userId: application.userId,
        name: application.name
      })
  })

  project.menteesApplication=newMenteesList;
  await project.save();

  res.status(200).json({ message: 'Changes successful.' });
});

// Mentor adds new task to project
exports.addTask = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  let taskId=projectId + project.tasks.length;
  let task={
    ...req.body,
    id: taskId,
    taskStatus: "pending",
  }

  project.tasks.push(task);
  await project.save();

  res.status(200).json({ message: 'Task added successfully.' });
});

// Mentor adds new contributor
exports.addTaskContributor = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskId;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  
  const taskIndex=project.tasks.findIndex(currTask => currTask.id===taskId);
  project.tasks[taskIndex].menteesAssigned.push(...req.body);

  await project.save();

  res.status(200).json({ message: 'Task added successfully.' });
});

// Mentor removes a contributor
exports.removeTaskContributor = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskId;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  
  const taskIndex=project.tasks.findIndex(currTask => currTask.id===taskId);
  project.tasks[taskIndex].menteesAssigned=project.tasks[taskIndex].menteesAssigned.filter(mentee=>{ mentee.userId!==req.body.removeUserId })

  await project.save();

  res.status(200).json({ message: 'Task added successfully.' });
});


// Selected mentees get their assigned tasks
exports.getAssignedTasks = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const assignedTaskIds = project.menteesApproved.find(mentee => mentee.userId === req.user.id).assignedTaskIds;
  const menteeTasks = assignedTaskIds.map(taskId=> {
    return project.tasks.find(ele=> ele.id===taskId)
  })
  res.json(menteeTasks);
});

// Selected mentees upload their work
exports.uploadTaskWork = catchAsyncErrors(async (req, res) => {
  
});

// Mentor marks the task complete
exports.markTaskComplete = catchAsyncErrors(async (req, res) => {
  
});