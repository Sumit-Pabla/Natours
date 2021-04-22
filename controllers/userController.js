const fs = require("fs");
const AppError = require("../utils/AppError");
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')



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



  