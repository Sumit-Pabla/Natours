const Tour = require('./../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getOverview = catchAsync( async(req, res) => {
    const tours = await Tour.find();

    resSecurityOverwrite(res);


  res.status(200).render("overview", {
    title: "All Tours",
    tours
  });
});



exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    resSecurityOverwrite(res);
    if(!tour){
        return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    });
});

exports.getLoginForm = (req, res) => {
    resSecurityOverwrite(res);
    res.status(200).render('login', {
        title: 'Log into your account'
    })
}


resSecurityOverwrite = (res) => {
     res.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com; base-uri 'self'; block-all-mixed-content; font-src 'self' https:; frame-ancestors 'self'; img-src 'self' blob: data:; object-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    );
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    })
}