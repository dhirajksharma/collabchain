const catchAsyncErrors = require("../middleware/catchAsyncError");
const Organization = require("../models/organizationModel");
const ApiResponse = require("../utils/ApiResponse");

exports.getAllOrg=catchAsyncErrors(async (req, res, next)=>{
    const org = await Organization.find({});
    console.log(org);
    return res.status(201).json(new ApiResponse(201, org, "Organization retrieved successfully"));
});