const {Web3} = require('web3');
const web3 = new Web3(process.env.ETH_URL);

const {contractABI} = require('./contractABI.js');
const contractAddress = process.env.ETH_ADDRESS;

// Create an instance of the contract
const collabChainTaskLogContract = new web3.eth.Contract(contractABI, contractAddress);

// 1. Create a project
exports.createProject=async function createProject(projectId, sender) {
    const createProjectTx = await collabChainTaskLogContract.methods.createProject(projectId).send({
        from: process.env.MENTORETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('Project created:', createProjectTx);
}

// 2. Create a task
exports.createTask=async function createTask(projectId, taskId, sender) {
    const createTaskTx = await collabChainTaskLogContract.methods.createTask(projectId, taskId).send({
        from: process.env.MENTORETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('Task created:', createTaskTx);
}

// 3. Assign a user to a task
exports.assignUser=async function assignUser(projectId, taskId, userAddress, sender) {
    const assignUserTx = await collabChainTaskLogContract.methods.assignUser(projectId, taskId, userAddress).send({
        from: process.env.MENTORETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('User assigned to task:', assignUserTx);
}

// 4. Remove a user from a task
exports.removeUser=async function removeUser(projectId, taskId, userAddress, sender) {
    const removeUserTx = await collabChainTaskLogContract.methods.removeUser(projectId, taskId, userAddress).send({
        from: process.env.MENTORETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('User removed from task:', removeUserTx);
}

// 5. Create a document for a task
exports.createDocument=async function createDocument(taskId, documentId, content, sender) {
    const createDocumentTx = await collabChainTaskLogContract.methods.createDocument(taskId, documentId, content).send({
        from: process.env.MENTEEETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('Document created:', createDocumentTx);
}

// 6. Mark a task as complete
exports.completeTask=async function completeTask(projectId, taskId, sender) {
    const completeTaskTx = await collabChainTaskLogContract.methods.completeTask(projectId, taskId, key).send({
        from: process.env.MENTORETH, // Replace with the sender's address
        gas: '5000000', // Adjust the gas value as needed
    });
    console.log('Task marked as complete:', completeTaskTx);
}

// export default {createProject, createTask, createDocument, assignUser, removeUser, completeTask};