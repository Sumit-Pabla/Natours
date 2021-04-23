const fs = require("fs");
const AppError = require("../utils/AppError");
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.included(el)) newObj[el] = obj[el]
  })
}
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  })})
  
exports.updateMe = async(req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updatedmypassword'), 400);
  }

  constfilteredBody = filterObj(req.body, 'name', 'email')
  const updatedUser = await User.findByIdandUpdate(req.user.id, filteredBody, {
    new: true, 
    runValidators: true
  });
  user.name = 'Jonas';
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
}

  exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: "This route is not yet defined"
    });
  }
  
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: "This route is not yet defined"
    });
  }
  
  exports.createUser = catchAsync(async(req, res) => {
    const newUser = await User.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      tour: newUser,
    },
  });
  })
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: "This route is not yet defined"
    });
  }

  exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
      status: 'success',
      data: null
    })


  })



  