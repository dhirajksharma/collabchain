const Web3 = require('web3');
const contractABI = [/* Paste your contract's ABI here */];
const contractAddress = process.env.ETH_ADDRESS; // Replace with your contract's deployed address
const web3 = new Web3(process.env.ETH_URL); // Replace with your Ethereum node URL

// Create an instance of the contract
const collabChainTaskLogContract = new web3.eth.Contract(contractABI, contractAddress);

// 1. Create a project
async function createProject(projectId, sender) {
    const createProjectTx = await collabChainTaskLogContract.methods.createProject(projectId).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('Project created:', createProjectTx);
}

// 2. Create a task
async function createTask(projectId, taskId, sender) {
    const createTaskTx = await collabChainTaskLogContract.methods.createTask(projectId, taskId).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('Task created:', createTaskTx);
}

// 3. Assign a user to a task
async function assignUser(projectId, taskId, userAddress, sender) {
    const assignUserTx = await collabChainTaskLogContract.methods.assignUser(projectId, taskId, userAddress).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('User assigned to task:', assignUserTx);
}

// 4. Remove a user from a task
async function removeUser(projectId, taskId, userAddress, sender) {
    const removeUserTx = await collabChainTaskLogContract.methods.removeUser(projectId, taskId, userAddress).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('User removed from task:', removeUserTx);
}

// 5. Create a document for a task
async function createDocument(taskId, documentId, content, sender) {
    const createDocumentTx = await collabChainTaskLogContract.methods.createDocument(taskId, documentId, content).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('Document created:', createDocumentTx);
}

// 6. Mark a task as complete
async function completeTask(projectId, taskId, key, sender) {
    const completeTaskTx = await collabChainTaskLogContract.methods.completeTask(projectId, taskId, key).send({
        from: sender, // Replace with the sender's address
        gas: '50000', // Adjust the gas value as needed
    });
    console.log('Task marked as complete:', completeTaskTx);
}

export {createProject, createTask, createDocument, assignUser, removeUser, completeTask};