const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const Project = require('../models/projectModel');
const Organization=require("../models/organizationModel");
const User=require("../models/userModel");
const ApiResponse=require("../utils/ApiResponse");
const fs=require("fs");
const path=require('path');
const archiver=require('archiver');
const sendEmail=require("../utils/sendEmail");

const {
  createProject,
  createTask,
  assignUser,
  removeUser,
  createDocument,
  updateTaskStatus
} = require("../contract/contractAPI");

// Get all projects on public feed
exports.getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const publicProjects = await Project.find({
    $or: [
      { endDate: { $lt: new Date() } },
      { menteesRequired: { $gt: 0 } }
    ]
  });
  res.status(201).json(new ApiResponse(201, publicProjects));
});

// Mentor creates a new project
exports.createProject = catchAsyncErrors(async (req, res, next) => {
  const mentor = req.user.id;
  const mentorAddress = req.user.ethAddress;

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
      token: req.body.token,
      menteesRequired: req.body.menteesRequired,
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
  const user = await User.findById(req.user.id);
  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  const mentor = await User.findById(project.mentor);

  project.menteesApplication.push({user: req.user.id});
  user.projects_applied.push(projectId);
  await project.save();
  await user.save();

  await sendEmail({
    email: mentor.email,
    subject: `${project.title} | Contributor Application`,
    message: `You have receiced a new application for the project ${project.title}.`,
  });

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
exports.approveMenteeStatus = catchAsyncErrors(async (req, res, next) => {
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
  
  let indx = project.menteesApplication.findIndex(application => application.user == userId);
  project.menteesApplication[indx].status = "approved";

  await sendEmail({
    email: usr.email,
    subject: `${project.title} | Contributor Application`,
    message: `Your application for contribution to the project ${project.title} has been approved.`,
  });
  
  await project.save();
  await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');

  return res.status(201).json(new ApiResponse(201, project, "Status updated"));
});

exports.rejectMenteeStatus = catchAsyncErrors(async (req, res, next) => {
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

  let indx = project.menteesApplication.findIndex(application => application.user == userId);
  project.menteesApplication[indx].status = "rejected";

  await sendEmail({
    email: usr.email,
    subject: `${project.title} | Contributor Application`,
    message: `Your application for contribution to the project ${project.title} has been rejected.`,
  });
  
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

  if (req.body.token <= 0 || req.body.token > project.token) {
    return next(new ErrorHander("Invalid Token Count", 403));
  }
  
  let taskId = projectId + project.tasks.length;
  const mentorAddress = req.user.ethAddress;
  let task = {
    title: req.body.title,
    description: req.body.description,
    token: req.body.token,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    id: taskId,
  }

  try {
    project.tasks.push(task);
    project.token -= req.body.token;
    
    await project.save();
    await project.populate('mentor organization menteesApplication.user menteesApproved.user tasks.menteesAssigned', 'name email');
    
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const filepath = `./uploads/${projectId}/${taskId}/mentor/`;
    
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true });
    }
    
    for (const file of files) {
      const filename = file.name;
      try {
        await new Promise((resolve, reject) => {
          file.mv(filepath + filename, function (err) {
            if (err) {
              return reject(new ErrorHander("Upload failed", 401));
            }
            resolve();
          });
        });
      } catch (error) {
        return next(new ErrorHander(error.message, 500));
      }
    }
    
    await createTask(projectId, taskId, mentorAddress);
    return res.status(201).json(new ApiResponse(201, project, "Task added successfully"));
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
});

// Mentor modifies task
exports.modifyTask = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  if(req.user.id!=project.mentor){
    return next(new ErrorHander("You are not authorized to access this page",403));
  }

  let taskId = req.body.taskId;
  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  
  if(req.body.token!="" && req.body.token<=0){
    return next(new ErrorHander("Invalid Token Count",403));
  }else if(req.body.token!=""){
    if(req.body.token > project.tasks[taskIndex].token && (req.body.token - project.tasks[taskIndex].token)<=project.token)
      project.tasks[taskIndex].token=req.body.token;
    else if(req.body.token < project.tasks[taskIndex].token){
      project.token += project.tasks[taskIndex].token - req.body.token;
      project.tasks[taskIndex].token=req.body.token;
    }
  }
  
  
  
  
  if(req.body.description)
    project.tasks[taskIndex].description=req.body.description;


  if(req.body.priority)
    project.tasks[taskIndex].priority=req.body.priority;

  if(req.body.dueDate)
    project.tasks[taskIndex].dueDate=req.body.dueDate;

  await project.save();
  return res.status(201).json(new ApiResponse(201, project, "Task updated successfully"));
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

  if (req.user.id != project.mentor) {
    return next(new ErrorHander("You are not authorized to access this page", 403));
  }

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  project.tasks[taskIndex].menteesAssigned.push(userId);

  const menteeId = project.menteesApproved.findIndex(currMentee => currMentee.user == userId)

  project.menteesApproved[menteeId].assignedTaskIds.push(taskId);
  if (project.tasks[taskIndex].taskStatus === 'pending')
    project.tasks[taskIndex].taskStatus = 'active';

  const mentorAddress = req.user.ethAddress;

  try {
    await assignUser(projectId, taskId, mentee.ethAddress, mentorAddress);
    await project.save();

    await sendEmail({
      email: mentee.email,
      subject: `${project.title} | Tasks Assignment`,
      message: `You have receiced a new task under the project ${project.title}.`,
    });

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

  const menteeId = project.menteesApproved.findIndex(currMentee => currMentee.user == userId)
  project.menteesApproved[menteeId].assignedTaskIds = project.menteesApproved[menteeId].assignedTaskIds.filter(taskID => { taskID !== taskId })

  if (project.tasks[taskIndex].menteesAssigned.length === 0)
    project.tasks[taskIndex].taskStatus = 'pending';

  try {
    await removeUser(projectId, taskId, mentee.ethAddress, mentorAddress);
    await project.save();

    await sendEmail({
      email: mentee.email,
      subject: `${project.title} | Tasks Assignment`,
      message: `You have been removed from the task titled:"${project.tasks[taskIndex].title}" under the project ${project.title}.`,
    });

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
  
  const mentor = await User.findById(project.mentor);

  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  if (project.tasks[taskIndex].menteesAssigned.findIndex(currMentee => currMentee == req.user.id) == -1) {
    return next(new ErrorHander("You are not authorized to access this page", 403));
  }

  const menteeAddress = req.user.ethAddress;
  const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
  const filepath = `./uploads/${projectId}/${taskId}/mentee/`;

  if (project.tasks[taskIndex].taskStatus == "active") {
    project.tasks[taskIndex].taskStatus = "submit";
  } else {
    return next(new ErrorHander("You have already uploaded the documents", 401));
  }

  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }

  for (const file of files) {
    const filename = file.name;
    const hash = crypto.createHash('sha256');
    hash.update(file.data);
    const fileHash = hash.digest('hex');

    try {
      await new Promise((resolve, reject) => {
        file.mv(filepath + filename, function (err) {
          if (err) {
            return reject(new ErrorHander("Upload failed", 401));
          }
          resolve();
        });
      });

      await createDocument(taskId, taskId + '123', fileHash, menteeAddress);
      await project.save();
    } catch (error) {
      return next(new ErrorHander("Server Error", 500));
    }
  }

  await sendEmail({
    email: mentor.email,
    subject: `${project.title} | Task Submission`,
    message: `You have receiced a new submission for the task:"${project.tasks[taskIndex].title}" under the project ${project.title}.`,
  });
  return res.status(201).json(new ApiResponse(201, null, "upload successful"));
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

exports.getTaskDocs = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  try {
    const directoryPath = path.join(__dirname, `../uploads/${projectId}/${taskId}/mentor`);
    const files = await fs.promises.readdir(directoryPath);

    const zip = archiver('zip', { zlib: { level: 9 } }); // Sets the compression level.
    zip.on('error', err => { throw err; });

    res.attachment('files.zip');
    zip.pipe(res);

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      zip.file(filePath, { name: file });
    });

    zip.finalize();
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
});

exports.reviewTask = catchAsyncErrors(async (req, res, next) => {
  const projectId = req.params.projectid;
  const taskId = req.params.taskid;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ErrorHander("Project not found", 400));
  }

  
  if(req.user.id!=project.mentor){
    return next(new ErrorHander("You are not authorized to access this page",403));
  }
  
  const mentorAddress = req.user.ethAddress;
  const taskIndex = project.tasks.findIndex(currTask => currTask.id == taskId);
  const mentee = await User.findById(project.tasks[taskIndex].menteesAssigned[0]);

  try {
    await updateTaskStatus(projectId, taskId, mentorAddress, "review");
    project.tasks[taskIndex].taskStatus = 'review';

    await sendEmail({
      email: mentee.email,
      subject: `${project.title} | Task Submission`,
      message: `Your submissions for the task:"${project.tasks[taskIndex].title}" under the project ${project.title} are being reviewed right now.`,
    });

    await project.save();

    const directoryPath = path.join(__dirname, `../uploads/${projectId}/${taskId}/mentee`);
    const files = await fs.promises.readdir(directoryPath);

    const zip = archiver('zip', { zlib: { level: 9 } }); // Sets the compression level.
    zip.on('error', err => { throw err; });

    res.attachment('files.zip');
    zip.pipe(res);

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      zip.file(filePath, { name: file });
    });

    zip.finalize();
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
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
  const mentorAddress = req.user.ethAddress;

  try {
    if(req.body.status=="complete"){
      project.tasks[taskIndex].taskStatus = 'complete';
      
      let eachToken = project.tasks[taskIndex].token / project.tasks[taskIndex].menteesAssigned.length;
      project.tasks[taskIndex].menteesAssigned.forEach(async id => {
        let user = await User.findById(id);
        user.token += eachToken;
        await user.save();
      })
    }else{
      project.tasks[taskIndex].taskStatus = 'active';
    }
    
    const mentee = await User.findById(project.tasks[taskIndex].menteesAssigned[0]);
    await sendEmail({
      email: mentee.email,
      subject: `${project.title} | Task Submission`,
      message: `Your submissions for the task:"${project.tasks[taskIndex].title}" under the project ${project.title} has been reviewed and is now marked ${req.body.status}.`,
    });

    await updateTaskStatus(projectId, taskId, mentorAddress, req.body.status);
    await project.save();
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }

  return res.status(201).json(new ApiResponse(201, project, "Task Marked Successfully"));
});