const mongoose = require('mongoose')
const dotenv = require('dotenv');


process.on('uncaughtexception', err => {
  console.log(err.name, err.message)
    process.exit(1)
})

dotenv.config({path: './config.env'})
const app = require('./app')

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


//STARTING SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
