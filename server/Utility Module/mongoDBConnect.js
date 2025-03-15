const mongoose = require("mongoose")


const connectToMongo = async (url) => {
    mongoose.connect(url).then(() => {
        console.log("Mongo DB Connected Succesfully")
    })
        .catch((err) => {
            console.log("Error in connecting to MongoDb " + err)
        })
}


module.exports = connectToMongo