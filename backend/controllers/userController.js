const ErrorHander = require("../utils/errorhander");
const ApiResponse = require("../utils/ApiResponse");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const Organization=require("../models/organizationModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const path = require("path");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const userExists = await User.findOne({email: req.body.email});
    
    if(!userExists){
        let org = await Organization.findOne({email: req.body.organization.email});
        if (!org) {
            org = await Organization.create({
                name: req.body.organization.name,
                email: req.body.organization.email,
                address: req.body.organization.address
            });
        }
        
        let orgId = org._id;
        req.body.organization={
            organization_details: orgId,
            designation: req.body.organization.designation
        }
        const user = await User.create({
            ...req.body,
        });

        await user.populate('projects_saved projects_ongoing projects_completed','title description');
        await user.populate('organization.organization_details')
    
        sendToken(user, 201, res);
    }else{
        return next(new ErrorHander("User Already exists", 400));
    }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    await user.populate('projects_saved projects_ongoing projects_completed','title description');
    await user.populate('organization.organization_details')
    
    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true
    });

    res.status(200).json(new ApiResponse(200, null, "Logout Successful"));
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json(new ApiResponse(200, null, `Email sent to ${user.email} successfully`));
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired",400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await user.populate('projects_saved projects_ongoing projects_completed','title description');
    await user.populate('organization.organization_details')

    sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    await user.populate('projects_saved projects_ongoing projects_completed','title description');
    await user.populate('organization.organization_details')

    if(!user){
        return next(new ErrorHander("User not found", 400));
    }else{
        res.status(200).json(new ApiResponse(200, user));
    }
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired",400));
    }
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    await user.populate('projects_saved projects_ongoing projects_completed','title description');
    await user.populate('organization.organization_details')

    sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    if(req.body.organization) {
        let org = await Organization.findOne({email: req.body.organization.email});
        if (!org) {
            org = await Organization.create({
                name: req.body.organization.name,
                email: req.body.organization.email,
                address: req.body.organization.address
            });
        }

        let orgId = org._id;
        req.body.organization={
            organization_details: orgId,
            designation: req.body.organization.designation
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    await user.populate('projects_saved projects_ongoing projects_completed','title description');
    await user.populate('organization.organization_details')
    
    res.status(200).json(new ApiResponse(200, user));
});


// Send verification Email
exports.sendVerificationEmail = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    // Generate a unique verification token
    const token = uuid.v4();
    //verificationTokens.push({ email, token });

    // Create the email content
    const mailOptions = {
        from: process.env.OUREMAILID,
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: http://localhost:3000/user/verifymail?token=${token}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return next(new ErrorHander('Email could not be sent.', 500));
        } else {
            res.status(200).json(new ApiResponse(200, payload, "Email sent successfully"));
        }
    });
});

//Verify Email by User
exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.query;

    // Check if the token exists in the verificationTokens array
    const verificationData = verificationTokens.find((item) => item.token === token);

    if (!verificationData) {
        return res.status(404).json({ message: 'Token not found or expired.' });
    }

    try {
        // Find the user by their email address and update their status to 'verified'
        const user = await User.findOneAndUpdate(
            { email: verificationData.email },
            { isVerified: true }
        );

        if (!user) {
            return next(new ErrorHander("User Not Found", 400));
        }

        // Remove the used token from the array (for one-time use tokens)
        verificationTokens.splice(verificationTokens.indexOf(verificationData), 1);

        // You can customize the response message according to your application's requirements
        return res.status(200).json(new ApiResponse(200, null, "Verification Successful"));
    } catch (error) {
        return next(new ErrorHander("Server Error", 500));
    }
});

//User uploads his resume or pic
exports.uploadFile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.userid;
    const user = await User.findById(userId);
  
    if (!user) {
      return next(new ErrorHander("User not found", 400));
    }
  
    const filetype=req.body.type;
    const file = req.files.file;
    
    file.mv(`./uploads/${filetype}/`+userId, function(err){
      if (err) {
        return next(new ErrorHander("Upload failed", 401));
      }else{
        return res.status(201).json(new ApiResponse(201, null, "upload successful"));
      }
    })
  });

exports.getFile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.userid;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHander("User not found", 400));
    }

    const filetype=req.body.type;
    const filePath = path.join(__dirname, `../uploads/${filetype}/${userId}`);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});