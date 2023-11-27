const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Project = require('../models/projectModel');
const { createProject, createTask, assignUser, removeUser, createDocument, completeTask } = require("../contract/contractAPI");

// Get all projects on public feed
exports.getAllProjects = catchAsyncErrors(async (req, res) => {
  const publicProjects = await Project.find({ endDate: { $lt: new Date() } });
  res.json(publicProjects);
});

// Mentor creates a new project
exports.createProject = catchAsyncErrors(async (req, res) => {
  const mentor = req.user.id; // Assuming you have mentor authentication
  const mentorAddress = req.body.ethAddress;
  const project = await Project.create({ ...req.body, mentor });
  createProject(project._id.toString(), mentorAddress);
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
  const projectId = req.params.projectid;

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

  project.menteesApplication.push(req.body);
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

  project.menteesApplication = project.menteesApplication.filter((application) => application.userId != req.user.id);
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

  let newMenteesList = req.body.menteesList;
  newMenteesList.forEach(application => {
    if (application.status === "approved") {
      project.menteesApproved.push({
        userId: application.userId,
        name: application.name
      })
    }
  })

  project.menteesApplication = newMenteesList;
  await project.save();

  res.status(200).json({ message: 'Changes successful.' });
  // add code to enable rejected candidates to re apply after some time gap
});

// Mentor adds new task to project
exports.addTask = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  let taskId = projectId + project.tasks.length;
  const mentorAddress = req.body.ethAddress;
  let task = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    id: taskId,
    taskStatus: "pending",
  }

  project.tasks.push(task);
  createTask(projectId, taskId, mentorAddress);
  await project.save();

  res.status(200).json({ message: 'Task added successfully.' });
});

// Mentor adds new contributor
exports.addTaskContributor = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  
  project.tasks[taskIndex].menteesAssigned.push({
    userId: req.body.userId,
    name: req.body.name
  });
  
  const menteeId=project.menteesApproved.findIndex(currMentee => currMentee.userId == req.body.userId)

  project.menteesApproved[menteeId].assignedTaskIds.push(taskId);
  if (project.tasks[taskIndex].taskStatus === 'pending')
    project.tasks[taskIndex].taskStatus = 'active';

  const mentorAddress = req.body.ethAddress;
  //assignUser(projectId, taskId, req.body.candidateEthAddress, mentorAddress);
  assignUser(projectId, taskId, process.env.MENTEEETH, mentorAddress);
  await project.save();

  res.status(200).json({ message: 'Task assigned successfully.' });
});

// Mentor removes a contributor
exports.removeTaskContributor = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const mentorAddress = req.body.ethAddress;
  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  
  project.tasks[taskIndex].menteesAssigned = project.tasks[taskIndex].menteesAssigned.filter(mentee => { mentee.userId !== req.body.removeUserId })
  
  const menteeId=project.menteesApproved.findIndex(currMentee => currMentee.userId == req.body.removeUserId)

  console.log(project.menteesApproved[menteeId])
  project.menteesApproved[menteeId].assignedTaskIds = project.menteesApproved[menteeId].assignedTaskIds.filter(taskID => { taskID !== taskId })
  
  if (project.tasks[taskIndex].menteesAssigned.length === 0)
    project.tasks[taskIndex].taskStatus = 'pending';

  //removeUser(projectId, taskId, req.body.removeUserAddress, mentorAddress);
  removeUser(projectId, taskId, process.env.MENTEEETH, mentorAddress);
  await project.save();

  res.status(200).json({ message: 'Task unassigned successfully.' });
});

// Selected mentees upload their work
exports.uploadTaskWork = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'project not found.' });
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  const menteeAddress = req.body.ethAddress;
  
  // project.tasks[taskIndex]
  const key=req.body.key;
  const file = req.files.file;
  const filename = file.name;
  
  const hash = crypto.createHash('sha256');
  hash.update(file.data);
  const fileHash = hash.digest('hex');
  
  console.log(fileHash);

  file.mv('./uploads/'+filename, function(err){
    if (err) {
      res.status(404).json(err);
    }else{
      res.status(200).json({ message: 'Uploaded successfully.' });
    }
  })

  createDocument(taskId, taskId+'123', fileHash, key, menteeAddress)

});

// Selected mentees get their assigned tasks
exports.getAssignedTasks = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const mentee = project.menteesApproved.find(mentee => mentee.userId == req.user.id)
  console.log(project.menteesApproved)
  console.log(req.user.id)
  const menteeTasks = mentee.assignedTaskIds.map(taskId => {
    return project.tasks.find(ele => ele.id === taskId)
  })
  res.json(menteeTasks);
});

// Mentor marks the task complete
exports.markTaskComplete = catchAsyncErrors(async (req, res) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  project.tasks[taskIndex].taskStatus='complete';

  const verificationKey = req.body.verificationKey;
  const mentorAddress = req.body.ethAddress;

  completeTask(projectId, taskId, verificationKey);
});