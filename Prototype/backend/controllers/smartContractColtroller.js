const catchAsyncErrors = require('./middleware/catchAsyncErrors'); // Import your error handling middleware
const Web3 = require('web3');
const web3 = new Web3('<YOUR_NODE_URL>'); // Replace with Ethereum node URL
const contractABI = []; // Fill this with the ABI of your contract
const contractAddress = '<YOUR_CONTRACT_ADDRESS>'; // Replace with your contract address

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Create a new task
exports.createTask = catchAsyncErrors(async (req, res) => {
    const taskId = req.params.taskId;
    try {
        await contract.methods.createTask(web3.utils.fromAscii(taskId)).send({ from: '<YOUR_MENTOR_ADDRESS>' });
        res.status(200).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Assign a user to a task
exports.assignUser = catchAsyncErrors(async (req, res) => {
    const taskId = req.params.taskId;
    const userAddress = req.params.userAddress;
    try {
        await contract.methods.assignUser(web3.utils.fromAscii(taskId), userAddress).send({ from: '<YOUR_MENTOR_ADDRESS>' });
        res.status(200).json({ message: 'User assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Check task status
exports.checkTaskStatus = catchAsyncErrors(async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const isComplete = await contract.methods.checkTaskStatus(web3.utils.fromAscii(taskId)).call();
        res.status(200).json({ isComplete });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
