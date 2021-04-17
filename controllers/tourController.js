const fs = require("fs");


tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
  
exports.checkId = (req, res, next, val) => {
    if(req.params.id*1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
      }
      next();
  }

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'missin'
        })
    }  
    next();
}


exports.getTour = (req, res, next) => {
    const id = req.params.id*1;
    const tour = tours.find(el => el.id === id)
    console.log(next)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }
  
exports.getAllTours = (req, res) => {
    console.log("Test")
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    })
  }

  exports.createTour = (req, res) => {
  
    const id = req.params.id*1;
  
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    console.log(newTour);
  
    tours.push(newTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(201).json({
          status: "success",
          data: {
            tour: newTour,
          },
        });
      }
    );
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
  
