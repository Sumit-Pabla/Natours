const mongoose = require('mongoose');

const reviewSchemas = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review cannot be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type:Date,
            deafult: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must beelong to a tour.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        },
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    });

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    })
})

    const Review = mongoose.model('Review', reviewSchema);

    module.exports = Review;