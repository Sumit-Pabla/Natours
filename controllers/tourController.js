const fs = require("fs");
const AppError = require("../utils/AppError");
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
};



exports.createTour = factory.createOne(Tour)

exports.getTour = factory.getOne(Tour, { path: 'reviews' })

exports.getAllTours = factory.getAll(Tour)

exports.updateTour = factory.updateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty', 
        num: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
        
      }      
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    
    res.status(200).json({
      status: 'success',
      stats
    })
})
  
  exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDate'
      },
      {
        $match: { 
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: 'startDates'},
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 6
      }
    ]);
    
    
    
    res.status(204).json({
      status: 'success',
      data: plan
    });
    
})
  
  // exports.createTour = catchAsync(async (req, res, next) => {
  //   // const newTours = new Tour({})
  //   // newTours.save()
  //   const newTour = await Tour.create(req.body)
  
  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // })
  
  // exports.getTour = catchAsync(async (req, res, next) => {
  //       const tour = await Tour.findById(req.params.id).populate('reviews');
    
  //       if(!tour){
  //       return next(new AppError('No tour found with that ID', 404))
  //   }
  //     // const tour = tours.find(el => el.id === id)
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         tour
  //       }
  //     })
  //   })
  
    // exports.updateTour = catchAsync(async (req, res, next) => {
    //   if(!tour){
    //     return next(new AppError('No tour found with that ID', 404))
    //   }
  
    //     const tour = await Tour.findByIdAndUpdate(req.params.id,req.body, {
    //       new: true,
    //       runValidators: true
    //     })
    //     res.status(200).json({
    //       status: 'success',
    //       data: {
    //         tour: '<updated tour view>'
    //       }
    //     })
     
    // })
    
    // exports.deleteTour = catchAsync(async (req, res) => {
    //   const tour = await Tour.findByIdAndDelete(req.params.id);
      
    //   if(!tour){
    //     return next(new AppError('No tour found with that ID', 404))
    //   }
    //   res.status(204).json({
    //     status: 'success',
    //     data: null
    //   });
    // })