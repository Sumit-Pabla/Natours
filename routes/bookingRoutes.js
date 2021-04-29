const bookingController = require('./../controllers/bookingController');
const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession)



module.exports = router;