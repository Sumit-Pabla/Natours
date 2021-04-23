const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email')
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
})}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //const token = signToken(newUser._id);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN})


    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})
exports.login = catchAsync( async(req, res, next) => {
    const {email, password} = req.body;

    //1) Check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    }

    //2) Check if user exists
    const users = User.findOne({ email }).select('+password')

    const correct = user.correctPassword(password, user.password);

    if(!user || !correct) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //3) Check is users exists and is correct
    const token = '';
    res.status(200).json({
        status: 'success',
        token
    })
    //4) if OK send token to client
})

exports.protect = catchAsync((req,res,next) => {
    // Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' '[``]);
    }


    if(!token) {
        return next(new AppError('You are not loffed in', 401));
    }
    //Validate token
    const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET); 
    //Check if user sitll exits

    const freshUser = User.findById(decoded.id)
    if(!freshUser) {
        return next(new AppError('The user belonging to this token no longer exits', 401))
    }
    //Check if user changed passwords after JWT was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed passsowrd!', 401))
    }
    req.user = freshUser; 
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
        return next(new AppError('You do not have permission to do this', 402))
    }
} 

exports.forgotPassword = catchAsync(async (req, res, next) => {

const user = await User.findOne({ email: req.body.email })
if(!user) {
    return next(new AppError('There is no users with that email', 404));
}

const resetToken = user.createPasswordResetToken();
await user.save({ validateBeforeSave: false });

const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

const message = `Forgot your pass? Submit a PATCH request with new password. Otherwise ignore this email`

try{
await sendEmail({
    email: user.email,
    subject: `Your reset tokesn is only valid for 10 minutes`,
    message
});
res.status(200).json({
    status: 'success',
    message: 'Token sent to email'
})}catch(err){
    user.passwordResetToekn = undefined;
    user.passwordRestExpires = undefined ; 
    await user.save({ validateBeforeSave: false });

    return next(new AppError(`There was an error sendint the email. Try again later`, 500))
}

})

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    
    
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordRestExpires: {$gt: Date.now()} });

    if(!user) {
        return next(new AppError('Token is invalid or expires', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })


})