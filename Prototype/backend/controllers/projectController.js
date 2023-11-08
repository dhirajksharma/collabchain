const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Project = require('../models/projectModels');
const User = require('../models/userModels');
const Task = require('../models/task');

// Middleware to check user type (public, mentor, mentee)
function checkUserType(req, res, next) {
  // Implement your logic here to determine the user type based on authentication or other factors
  // For simplicity, let's assume user type is determined and stored in req.userType
  req.userType = 'public'; // Example: 'public', 'mentor', 'mentee'
  next();
}

// Get all projects on public feed
exports.getAllProjects = catchAsyncErrors(async (req, res) => {
  const publicProjects = await Project.find({ visibility: 'public' });
  res.json(publicProjects);
});

// Mentor creates a new project
exports.createProject = catchAsyncErrors(async (req, res) => {
  if (req.userType !== 'mentor') {
    return res.status(403).json({ message: 'Only mentors can create projects.' });
  }

  const { title, description, visibility } = req.body;
  const mentorId = req.user.id; // Assuming you have mentor authentication

  const project = await Project.create({ title, description, visibility, mentorId });
  res.status(201).json(project);
});

// Users get project details (some details hidden based on user type: public, mentor, mentee)
exports.getProjectDetails = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  if (req.userType !== 'mentor' && req.userType !== 'mentee') {
    // For public users, hide some details (e.g., mentor's ID)
    project.mentorId = undefined;
  }

  res.json(project);
});

// Mentor edits project details
exports.editProject = catchAsyncErrors(async (req, res) => {
  if (req.userType !== 'mentor') {
    return res.status(403).json({ message: 'Only mentors can edit projects.' });
  }

  const projectId = req.params.id;
  const { title, description, visibility } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { title, description, visibility },
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  res.json(project);
});

// Users applying to a project
exports.applyToProject = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  // Implement your application logic here (e.g., add user to project's applicants list)
  // For simplicity, let's assume successful application
  project.applicants.push(req.user.id); // Assuming you have user authentication
  await project.save();

  res.status(200).json({ message: 'Application successful.' });
});

// Users withdrawing their application
exports.withdrawApplication = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  // Implement your withdrawal logic here (e.g., remove user from project's applicants list)
  // For simplicity, let's assume successful withdrawal
  project.applicants = project.applicants.filter((applicantId) => applicantId !== req.user.id);
  await project.save();

  res.status(200).json({ message: 'Withdrawal successful.' });
});

// Selected mentees get their assigned tasks
exports.getAssignedTasks = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  // Implement your logic to fetch assigned tasks based on user authentication
  // For simplicity, let's assume that tasks are fetched for the current user (mentee)
  const menteeTasks = await Task.find({ assigneeId: req.user.id });

  res.json(menteeTasks);
});

// Selected mentees upload their work
exports.uploadTaskWork = catchAsyncErrors(async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  // Implement your logic to handle task work uploads
  // For simplicity, let's assume a successful upload
  task.work = req.body.work; // Assuming 'work' is the field to store task work
  await task.save();

  res.status(200).json({ message: 'Task work uploaded successfully.' });
});
