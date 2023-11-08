// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define the CollabChain contract
contract CollabChain {
    // Struct to represent a research project
    struct ResearchProject {
        address owner;        // Owner of the project
        string title;         // Title of the project
        string description;   // Description of the project
        bool isActive;        // Status of the project (active or closed)
    }

    ResearchProject[] public projects; // Array to store all research projects

    // Mapping to track which projects are owned by each user
    mapping(address => uint256[]) public userProjects;

    // Event emitted when a new project is created
    event ProjectCreated(uint256 projectId, address owner, string title);

    // Event emitted when a project is closed
    event ProjectClosed(uint256 projectId);

    // Modifier to restrict certain actions to the project owner
    modifier onlyProjectOwner(uint256 projectId) {
        require(msg.sender == projects[projectId].owner, "Only project owner can perform this action");
        _;
    }

    // Constructor (optional)
    constructor() {
        // Initialize contract if needed
    }

    // Function to create a new research project
    function createProject(string memory _title, string memory _description) external {
        // Create a new ResearchProject struct
        ResearchProject memory newProject = ResearchProject({
            owner: msg.sender,
            title: _title,
            description: _description,
            isActive: true
        });

        uint256 projectId = projects.length;
        projects.push(newProject);
        userProjects[msg.sender].push(projectId);

        // Emit an event to notify project creation
        emit ProjectCreated(projectId, msg.sender, _title);
    }

    // Function to close a research project
    function closeProject(uint256 projectId) external onlyProjectOwner(projectId) {
        require(projectId < projects.length, "Project does not exist");

        // Set the project status to closed
        projects[projectId].isActive = false;

        // Emit an event to notify project closure
        emit ProjectClosed(projectId);
    }
}
