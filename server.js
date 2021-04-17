const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', 
process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log(`Successful DB connection`)

})
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    reuired: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);
console.log(Tour)

console.log(process.env)

//STARTING SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
