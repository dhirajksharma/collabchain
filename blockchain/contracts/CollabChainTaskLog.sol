// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollabChainTaskLog {
    //hash map for project ids corresponding to mentors and task ids
    mapping(string => address) projectMentors;
    mapping(string => Task) public tasks;
    mapping(string => string) documentHash;
    
    //data structure to store task details
    struct Task {
        string projectId;
        string status;
        address[] assignedUsers; //array of users allocated to the task
        string[] documentIDs; //array of document ids and their content hash to verify against tampered documents
    }

    //authroization checkers
    modifier onlyMentor(string memory projectId, address user) {
        require(projectMentors[projectId] == user, "Only mentor can perform this action");
        _;
    }

    modifier onlyAssigned(string memory taskId, address user) {
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
    event ProjectCreated(address mentr);
    event TaskCreated();
    event UserAssigned();
    event UserRemoved();
    event DocumentCreated();
    event TaskUpdated();

    //generate verification key
    function generateKey() internal view returns (bytes32) {
        uint256 seed = uint256(block.timestamp) + uint256(blockhash(block.number - 1));
        return keccak256(abi.encodePacked(seed));
    }

    //compare verification key strings
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        bytes memory strA = bytes(a);
        bytes memory strB = bytes(b);
        if (strA.length != strB.length) {
            return false;
        }
        for (uint i = 0; i < strA.length; i++) {
            if (strA[i] != strB[i]) {
                return false;
            }
        }
        return true;
    }

    //mentor creates a project
    function createProject(string memory projectId) public{
        projectMentors[projectId]=msg.sender;
        emit ProjectCreated(projectMentors[projectId]);
    }

    //mentor creates a task
    //upon creation a verification key is generated which will be used later
    function createTask(string memory projectId, string memory taskId) public onlyMentor(projectId, msg.sender) {
        tasks[taskId] = Task({
            projectId: projectId,
            status: "pending",
            assignedUsers: new address[](0),
            documentIDs: new string[](0)
        });
        emit TaskCreated();
    }

    //mentor assigns a user to contribute to the task
    function assignUser(string memory projectId, string memory taskId, address user) public onlyMentor(projectId, msg.sender)  {
        tasks[taskId].assignedUsers.push(user);
        tasks[taskId].status="active";
        emit UserAssigned();
    }

    //mentor removes a user from the task
    //will add checks to verify from the user before removing
    function removeUser(string memory projectId, string memory taskId, address user) public onlyMentor(projectId, msg.sender)  {
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
    function createDocument(string memory taskId, string memory documentId, string memory content) public onlyAssigned(taskId, msg.sender)  {
        tasks[taskId].documentIDs.push(documentId);
        documentHash[documentId]=content;
        emit DocumentCreated();
    }

    //mentor marks the task complete by entering the verification key given to them by the user
    //verifying this key against our original key to check authenticity
    function updateTaskStatus(string memory projectId, string memory taskId, string memory status) public onlyMentor(projectId, msg.sender)  {
        tasks[taskId].status = status;
        emit TaskUpdated();
    }
}