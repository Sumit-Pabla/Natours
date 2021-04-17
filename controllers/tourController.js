const fs = require("fs");
const Tour = require('./../models/tourModel');







exports.getTour = (req, res, next) => {
    const id = req.params.id*1;
    // const tour = tours.find(el => el.id === id)
    // console.log(next)
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     tour
    //   }
    // })
  }
  
exports.getAllTours = (req, res) => {
    console.log("Test")
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      // results: tours.length,
      // data: {
      //   tours
      // }
    })
  }

  exports.createTour = async (req, res) => {
    try{
    // const newTours = new Tour({})
    // newTours.save()
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch(err){
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
  }
  
  exports.updateTour = (req, res) => {
    
    
  
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<updated tour view>'
      }
    })
  }
  
  exports.deleteTour = (req, res) => {
    
  
    res.status(204).json({
      status: 'success',
      data: null
    })
  }
  
