const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', 
process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Successful DB connection`)

})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try{
        await Tour.create(tours)
        console.log(`data successfully loaded`)
    }catch(err){
        console.log(err)
    }
    process.exit();
}

//Delete all data from collection 
const deleteData = async () => {
    await Tour.deleteMany();
    process.exit();
}
if (process.argv[2] === '--import'){
    importData();
} else if (process.argv[2] === '--delete'){
    deleteData();
}
console.log(process.argv)