const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const Project = require('../models/projectModel');
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const ApiResponse = require("../utils/ApiResponse");
const fs = require("fs");

const {
  createProject,
  createTask,
  assignUser,
  removeUser,
  createDocument,
  completeTask
} = require("../contract/contractAPI");

// Get all projects on public feed
exports.getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const publicProjects = await Project.find({
    $or:[
      { endDate: { $lt: new Date() } },
      { menteesRequired : { $gt: 0 } }
    ]
  });
  res.status(201).json(new ApiResponse(201, publicProjects));
});

// Mentor creates a new project
exports.createProject = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  console.log(req.cookies);
  const mentor = req.user.id;
  const mentorAddress = req.user.ethAddress;
  console.log(mentor);
  console.log(mentorAddress);

  let project;

  try {

    let orgId = req.body.organization.id;
    if (orgId == null) {
      let org = await Organization.create({
        name: req.body.organization.name,
        email: req.body.organization.email,
        address: req.body.organization.address
      });

      orgId = org._id;
    }

    project = await Project.create({
      mentor,
      organization: orgId,
      title: req.body.title,
      domain: req.body.domain,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    
    await createProject(project._id.toString(), mentorAddress);
    // const grpMembers=new Array(project.mentor);
    // const groupChat = await Chat.create({
    //   name: project.title,
    //   isGroupChat: true,
    //   admin: project.mentor,
    //   participants: grpMembers,
    //   projectId: project._id;
    // });

    await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
    
    res.status(201).json(new ApiResponse(201, project, "Project made successfully"));
  } catch (error) {
    if (project && project._id) {
      //await Chat.findOneAndDelete({isGroupChat: true, projectId: project._id});
      await Project.findByIdAndDelete(project._id);
    }
    return next(new ErrorHander("Server Error", 500));
  }
});

// Users get project details (some details hidden based on user type: public, mentor, mentee)
exports.getProjectDetails = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
    
  return res.status(201).json(new ApiResponse(201, project, "Project found"));
});

// Mentor edits project details
exports.editProject = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { ...req.body },
    { new: true }
  );

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');

  return res.status(201).json(new ApiResponse(201, project, "Project found"));
});

// User saves project to watchlist
exports.saveProject = catchAsyncErrors(async (req, res, next) =>{
  const projectId = req.params.projectid;
  let usr = await User.findById(req.user.id);
  
  let indx = usr.projects_saved.indexOf(projectId);
  if(indx>-1)
    usr.projects_saved.splice(indx, 1);
  else
    usr.projects_saved.push(projectId);

  await usr.save();
  await usr.populate('projects_saved projects_ongoing projects_completed','title description');
  await usr.populate('organization.organization_details')

  if(indx>-1)
    return res.status(201).json(new ApiResponse(201, usr, "Project removed successfully"));
  else
  return res.status(201).json(new ApiResponse(201, usr, "Project saved successfully"));
})

// Users applying to a project
exports.applyToProject = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  project.menteesApplication.push({user: req.user.id});
  await project.save();
  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
  
  return res.status(201).json(new ApiResponse(201, project, "Application successful"));
});

// Users withdrawing their application
exports.withdrawApplication = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  project.menteesApplication = project.menteesApplication.filter((application) => (application.user != req.user.id || (application.user == req.user.id && application.status != 'pending')));
  await project.save();
  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
  
  return res.status(201).json(new ApiResponse(201, project, "Application withdrawn"));
});

// Mentor updates mentee status
exports.updateMenteeStatus = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const userId = req.params.userid;
  const project = await Project.findById(projectId);
  const usr = await User.findById(userId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if (!usr) {
    return next(new ErrorHander("Mentee not found", 400));
  }

  if(req.user.id != project.mentor){
    return next(new ErrorHander("You are not authorized to access this page",403));
  }

  usr.projects_ongoing.push(projectId);
  await usr.save();
  
  project.menteesRequired-=1;
  project.menteesApproved.push({
    user: userId,
  })
  project.menteesApplication = project.menteesApplication.filter(application => application.user != userId);
  await project.save();
  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');

  return res.status(201).json(new ApiResponse(201, project, "Status updated"));
});

// Mentor adds new task to project
exports.addTask = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if (req.user.id != project.mentor) {
    return next(new ErrorHander("You are not authorized to access this page", 403));
  }

  let taskId = projectId + project.tasks.length;
  const mentorAddress = req.user.ethAddress;
  let task = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    id: taskId,
  }

  try {
    await createTask(projectId, taskId, mentorAddress);
    project.tasks.push(task);
    await project.save();
    await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');

    return res.status(201).json(new ApiResponse(201, project, "Task added successfully"));
  } catch (error) {
    return next(new ErrorHander("Server Error", 500));
  }
});

// Mentor adds new contributor
exports.addTaskContributor = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const userId = req.params.userid;
  const project = await Project.findById(projectId);
  const mentee = await User.findById(userId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if (!mentee) {
    return next(new ErrorHander("Mentee not found", 400));
  }

  if(req.user.id!=project.mentor){
    return next(new ErrorHander("You are not authorized to access this page",403));
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  project.tasks[taskIndex].menteesAssigned.push(userId);
  
  const menteeId=project.menteesApproved.findIndex(currMentee => currMentee.user == userId)
  
  project.menteesApproved[menteeId].assignedTaskIds.push(taskId);
  if (project.tasks[taskIndex].taskStatus === 'pending')
    project.tasks[taskIndex].taskStatus = 'active';

  const mentorAddress = req.user.ethAddress;

  try{
    await assignUser(projectId, taskId, mentee.ethAddress, mentorAddress);
    await project.save();
    await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
    return res.status(201).json(new ApiResponse(201, project, "Task assigned successfully"));
  } catch (error) {
    return next(new ErrorHander("Server Error", 500));
  }
});

// Mentor removes a contributor
exports.removeTaskContributor = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const userId = req.params.userid;
  const project = await Project.findById(projectId);
  const mentee = await User.findById(userId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if (!mentee) {
    return next(new ErrorHander("Mentee not found", 400));
  }

  if(req.user.id!=project.mentor){
    return next(new ErrorHander("You are not authorized to access this page",403));
  }

  const mentorAddress = req.user.ethAddress;
  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  
  project.tasks[taskIndex].menteesAssigned = project.tasks[taskIndex].menteesAssigned.filter(mentee => { mentee.user !== userId })
  
  const menteeId=project.menteesApproved.findIndex(currMentee => currMentee.user == userId)
  project.menteesApproved[menteeId].assignedTaskIds = project.menteesApproved[menteeId].assignedTaskIds.filter(taskID => { taskID !== taskId })

  if (project.tasks[taskIndex].menteesAssigned.length === 0)
    project.tasks[taskIndex].taskStatus = 'pending';

  try{
    await removeUser(projectId, taskId, mentee.ethAddress, mentorAddress);
    await project.save();
    await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');

    return res.status(201).json(new ApiResponse(201, project, "Task unassigned"));
  } catch (error) {
    return next(new ErrorHander("Server Error", 500));
  }
});

// Selected mentees upload their work
exports.uploadTaskWork = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  const menteeAddress = req.user.ethAddress;

  const key = req.body.key || "abced";
  const file = req.files.file;
  const filename = file.name;
  const filepath = `./uploads/${projectId}/${taskId}/`

  const hash = crypto.createHash('sha256');
  hash.update(file.data);
  const fileHash = hash.digest('hex');

  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }

  file.mv(filepath + filename, function (err) {
    if (err) {
      return next(new ErrorHander("Upload failed", 401));
    }
  })

  try {
    await createDocument(taskId, taskId + '123', fileHash, key, menteeAddress)
    return res.status(201).json(new ApiResponse(201, null, "upload successful"));
  } catch (error) {
    return next(new ErrorHander("Server Error", 500));
  }
});

// Selected mentees get their assigned tasks
exports.getAssignedTasks = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  const mentee = project.menteesApproved.find(mentee => mentee.user == req.user.id)
  const menteeTasks = mentee.assignedTaskIds.map(taskId => {
    return project.tasks.find(ele => ele.id === taskId)
  })

  return res.status(201).json(new ApiResponse(201, menteeTasks, "Tasks retrieved"));
});

// Mentor marks the task complete
exports.markTaskComplete = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if (req.user.id != project.mentor) {
    return next(new ErrorHander("You are not authorized to access this page", 403));
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  project.tasks[taskIndex].taskStatus = 'complete';

  const verificationKey = req.body.verificationKey;
  const mentorAddress = req.user.ethAddress;

  try {
    await completeTask(projectId, taskId, verificationKey, mentorAddress);
    await project.save();
    return res.status(201).json(new ApiResponse(201, null, "Task verification complete"));
  } catch (error) {
    return next(new ErrorHander("Server Error", 500));
  }
});