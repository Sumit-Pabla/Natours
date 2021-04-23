const express = require("express");
const morgan = require("morgan")
const rateLimit = require('express-rate-limit')

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();



//Middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requesest from this IP. Try again in an hour'
});
app.use('/api', limiter)

app.use(express.json());
app.use(express.static(`${__dirname}/public`))



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Headers`);
  console.log(req.headers)
  next();
});


//ROUTES
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
 
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app;