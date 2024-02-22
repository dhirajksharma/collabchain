const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Organization = require("../models/organizationModel");

exports.findOrCreateOrg=catchAsyncErrors(async (req, res, next)=>{
    const {name: orgName} = req.body;
    let org = Organization.findOne({name: orgName});

    if(!org){
        org = await Organization.create({
            ...req.body
        })
    }

    return res
    .status(201)
    .json(new ApiResponse(201, org, "Organization retrieved successfully"));
});