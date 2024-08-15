const mongoose = require('mongoose')
require('dotenv').config()

exports.databaseConnection = () => {
    mongoose.connect(process.env.DATABSE_URL)
    .then( () => console.log('Database Connected successfully'))
    .catch( (error) => {
        console.log("Database connection failed")
        console.log(error)
        process.exit(1)
    })
}