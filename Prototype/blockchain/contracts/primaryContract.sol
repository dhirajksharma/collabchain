// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollabChainTaskLog {
    //hash map for project ids corresponding to mentors and task ids
    mapping(string => address) projectMentors;
    mapping(bytes32 => Task) public tasks;

    //data structure to store task details
    struct Task {
        string projectId;
        bool isComplete; //boolean to track task completion
        bytes32 verificationKey; //verification key for mentor to mark the task complete
        address[] assignedUsers; //array of users allocated to the task
        Document[] documents; //array of document ids and their content hash to verify against tampered documents
    }

    //data structure to store document details
    struct Document {
        bytes32 documentId;
        string content;
    }


    //authroization checkers
    modifier onlyMentor(string memory projectId, address user) {
        require(projectMentors[projectId] == user, "Only mentor can perform this action");
        _;
    }

    modifier onlyAssigned(bytes32 taskId, address user) {
        bool isAssigned = false;
        for (uint256 i = 0; i < tasks[taskId].assignedUsers.length; i++) {
            if (tasks[taskId].assignedUsers[i] == user) {
                isAssigned = true;
                break;
            }
        }
        require(isAssigned, "User is not assigned to this task");
        _;
    }

    //signals emitted by the blockchain upon a certain event
    event ProjectCreated();
    event TaskCreated();
    event UserAssigned();
    event UserRemoved();
    event DocumentCreated(bytes32 verificationKey);
    event TaskCompleted();

    //generate verification key
    function generateKey() internal view returns (bytes32) {
        uint256 seed = uint256(block.timestamp) + uint256(blockhash(block.number - 1));
        return keccak256(abi.encodePacked(seed));
    }

    //mentor creates a project
    function createProject(string memory projectId) public{
        projectMentors[projectId]=msg.sender;
        emit ProjectCreated();
    }

    //mentor creates a task
    //upon creation a verification key is generated which will be used later
    function createTask(string memory projectId, bytes32 taskId) public onlyMentor(projectId, msg.sender) {
        tasks[taskId] = Task({
            projectId: projectId,
            isComplete: false,
            verificationKey: generateKey(),
            assignedUsers: new address[](0),
            documents: new Document[](0)
        });
        emit TaskCreated();
    }

    //mentor assigns a user to contribute to the task
    function assignUser(string memory projectId, bytes32 taskId, address user) public onlyMentor(projectId, msg.sender) {
        require(!tasks[taskId].isComplete, "Task is already complete");
        tasks[taskId].assignedUsers.push(user);
        emit UserAssigned();
    }

    //mentor removes a user from the task
    //will add checks to verify from the user before removing
    function removeUser(string memory projectId, bytes32 taskId, address user) public onlyMentor(projectId, msg.sender) {
        require(!tasks[taskId].isComplete, "Task is already complete");
        address[] storage users = tasks[taskId].assignedUsers;
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == user) {
                users[i] = users[users.length - 1];
                users.pop(); // Remove the last element
                break;
            }
        }
        emit UserRemoved();
    }

    //assigned users add documents to the project
    //when they upload the documents, they will be given the verification key
    function createDocument(bytes32 taskId, bytes32 documentId, string memory content) public onlyAssigned(taskId, msg.sender) {
        require(!tasks[taskId].isComplete, "Task is already complete");
        tasks[taskId].documents.push(Document(documentId, content));
        emit DocumentCreated(tasks[taskId].verificationKey);
    }

    //mentor marks the task complete by entering the verification key given to them by the user
    //verifying this key against our original key to check authenticity
    function completeTask(string memory projectId, bytes32 taskId, bytes32 key) public onlyMentor(projectId, msg.sender) {
        require(!tasks[taskId].isComplete, "Task is already complete");
        require(keccak256(abi.encodePacked(key)) == keccak256(abi.encodePacked(tasks[taskId].verificationKey)), "Invalid verification key");
        tasks[taskId].isComplete = true;
        emit TaskCompleted();
    }

    //central server uses this function to check task status
    //before allowing mentor to access the documents
    function checkTaskStatus(bytes32 taskId) public view returns (bool) {
        return tasks[taskId].isComplete;
    }
}