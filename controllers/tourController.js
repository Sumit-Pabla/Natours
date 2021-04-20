const fs = require("fs");
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
};

exports.getTour = async (req, res, next) => {
    try{
      const tour = await Tour.findById(req.params.id);  
    
    // const tour = tours.find(el => el.id === id)
    console.log(next)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
}catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
})
  }}
  
exports.getAllTours = async (req, res) => {  
  try{

    //FILTERING
    // const queryObj = {...req.query}
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // let queryStr = JSON.stringify(queryObj);

    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // let query = Tour.find(JSON.parse(queryStr));

    //SORTING
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy)
    // }else {
    //   query = query.sort('id');
    // } 
    //FIELD LIMITING 
    
    // if(req.query.fields){

    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields)
    // } else{
    //   query = query.select('-__v');  
    // }

    //PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page-1) * limit;
    // query = query.skip(skip).limit(limit);

    // if(req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if(skip>numTours) {throw new Error('This path does not exists')}
    // }
    
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().paginate();
    console.log(features)
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    })}catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
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
      message: "invalid data sent!"
    })
  }
  }
  
  exports.updateTour = async (req, res) => {
    try{

      const tour = await Tour.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true
      })
      res.status(200).json({
        status: 'success',
        data: {
          tour: '<updated tour view>'
        }
      })
    } catch(err){
      res.status(400).json({
        status: "fail",
        message: "invalid data sent!"
      })
    }
    
  
   
  }
  
  exports.deleteTour = async (req, res) => {
    try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: "invalid data sent!"
    })
  }
  }
  
exports.getTourStats = async (req, res) => {
  try{
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
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: "invalid data sent!"
    })
  }
}