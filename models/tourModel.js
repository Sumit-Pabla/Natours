const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')


const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have <= 40 chars'],
      minlength: [10, 'A tour name must have >= 10 chars'],
      //validate: [validator.isAlpha, 'Tour name must only contain chars']

    },
    slug: {type: String},
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
      message: 'Only 3 possible difficulties' 
    }},
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'must be above 1.0'],
      max: [5, 'must be below 5.0']

    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {

      type: Number,
       validate: {
        validator: function(val) {
          return val < this.price;
        },
         message: "Discount price is > regular price"
        }
     },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover']
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
    

  }, {
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
  });
  
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true});
  next();
})

// tourSchema.pre('save', functions(next) {
//   console.log(`will save`)
//   next();
// })

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })

// tourSchema.post(/^find/, functions(docs, next) {
//   next();
// })

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true}});

  this.start = Date.now();
  next();
});

tourSchema.pre('aggregate', function(next) {
  thiks.pipeline().unshift( { $match: { secretTour: { $ne: true } } } )
})

  const Tour = mongoose.model('Tour', tourSchema);
  
  module.exports = Tour;