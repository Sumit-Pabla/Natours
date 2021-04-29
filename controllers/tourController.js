const fs = require("fs");
const AppError = require("../utils/AppError");
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true)
  }else{
    cb(new AppError('Not an image!', 400), false);
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3}
]);


exports.resizeTourImages = catchAsync(async(req, res, next) => {
  if(!req.files.imageCover || !res.files.images) return next();


  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.file.imageCover[0].buffer)
  .resize(2000, 1333)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(`public/img/tours/${req.body.imageCover}`);
  
  req.body.images = []


  await Promise.all(req.files.images.map(async (file, i) => {
    const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}-cover.jpeg`

    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
  })
  );


  next();
})


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

exports.getToursWithin = catchAsync( async (req, res, next) => {
  
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) {
    next( new AppError('Please provide lat and lon properly', 400 ))
  }

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radiu]}} })
  
  
  res.status(200).json({
    staus: 'success',
    data: {
      data: tours
    }
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng) {
    next( new AppError('Please provide lat and lon properly', 400 ))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng*1, lat*1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);  
  
  res.status(200).json({
    staus: 'success',
    data: {
      data: distances
    }
  })
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