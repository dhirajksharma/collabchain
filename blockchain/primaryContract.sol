// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollabChainTaskLog {
    address public mentor;

    //data structure to store task details
    struct Task {
        bool isComplete; //boolean to track task completion
        string verificationKey; //verification key for mentor to mark the task complete
        mapping(address => bool) assignedUsers; //array of users allocated to the task
        mapping(bytes32 => Document) documents; //array of document ids and their content hash to verify against tampered documents
    }

    //data structure to store document details
    struct Document {
        string content;
    }

    //hash map for tasks
    mapping(bytes32 => Task) public tasks;

    //authroization checkers
    modifier onlyMentor() {
        require(msg.sender == mentor, "Only mentor can perform this action");
        _;
    }

    modifier onlyAssigned(bytes32 taskId) {
        require(tasks[taskId].assignedUsers[msg.sender], "You are not assigned to this task");
        _;
    }

    //signals emitted by the blockchain upon a certain event
    event TaskCreated(bytes32 taskId);
    event UserAssigned(bytes32 taskId, address user);
    event UserRemoved(bytes32 taskId, address user);
    event DocumentCreated(bytes32 taskId, bytes32 documentId, string content, string verificationKey);
    event TaskCompleted(bytes32 taskId);

    //constructor stores identity of the mentor
    constructor() {
        mentor = msg.sender;
    }

    //generate verification key
    function generateKey() internal view returns (string memory) {
        uint256 seed = uint256(block.timestamp) + uint256(blockhash(block.number - 1));
        return keccak256(abi.encodePacked(seed));
    }

    //mentor creates a task
    //upon creation a verification key is generated which will be used later
    function createTask(bytes32 taskId) public onlyMentor {
        tasks[taskId] = Task({
            isComplete: false,
            verificationKey: generateKey();
        });
        emit TaskCreated(taskId);
    }

    //mentor assigns a user to contribute to the task
    function assignUser(bytes32 taskId, address user) public onlyMentor {
        require(!tasks[taskId].isComplete, "Task is already complete");
        tasks[taskId].assignedUsers[user] = true;
        emit UserAssigned(taskId, user);
    }

    //mentor removes a user from the task
    //will add checks to verify from the user before removing
    function removeUser(bytes32 taskId, address user) public onlyMentor {
        require(!tasks[taskId].isComplete, "Task is already complete");
        tasks[taskId].assignedUsers[user] = false;
        emit UserRemoved(taskId, user);
    }

    //assigned users add documents to the project
    //when they upload the documents, they will be given the verification key
    function createDocument(bytes32 taskId, bytes32 documentId, string memory content) public onlyAssigned(taskId) {
        require(!tasks[taskId].isComplete, "Task is already complete");
        tasks[taskId].documents[documentId] = Document(content);
        emit DocumentCreated(taskId, documentId, content, tasks[taskId].verificationKey);
    }

    //mentor marks the task complete by entering the verification key given to them by the user
    //verifying this key against our original key to check authenticity
    function completeTask(bytes32 taskId, string key) public onlyMentor {
        require(!tasks[taskId].isComplete, "Task is already complete");
        require(keccak256(abi.encodePacked(key)) == keccak256(abi.encodePacked(verificationKey)), "Invalid verification key");
        tasks[taskId].isComplete = true;
        emit TaskCompleted(taskId);
    }

    //central server uses this function to check task status
    //before allowing mentor to access the documents
    function checkTaskStatus(bytes32 taskId) public view returns (bool) {
        return tasks[taskId].isComplete;
    }
}