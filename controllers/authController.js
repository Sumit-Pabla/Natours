const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})
exports.login = (req, res, next) => {
    const {email, password} = req.body;

    //1) Check if email and password exist
    if(!email || !password){
        next(new AppError('Please provide email and password!', 400));
    }

    //2) Check if user exists


    //3) Check is users exists and is correct


    //4) if OK send token to client
}