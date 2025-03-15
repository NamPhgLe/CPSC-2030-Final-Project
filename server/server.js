const { signInUser } = require("../controllers/userController");

(() => {
    const connectToMongo = require("./Utility Module/mongoDBConnect")
    const requestResponseLogger = require("./Utility Module/requestResLogger")
    const { signUpUser, signInUser } = require("../controllers/userController");

    console.log(`current directory is ${__dirname}`)
    const homeController = require(`${__dirname}/../controllers/homeController`)
    const memberController = require(`${__dirname}/../controllers/memberController`)
    const config = require(`${__dirname}/config/config`)
    const utils = require(`${__dirname}/utils`)
    const express = require("express")

    const app = express()

    connectToMongo("mongodb+srv://mongo:mongo@cluster2030.9fajz.mongodb.net/");

    
    app.use(express.static(config.ROOT))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use((request, response, next) => {
        utils.logRequest(request)
        next()
    })
    app.use(homeController)
    app.use(memberController)

    // Middleware function to add all the api request data in mongoDb
    app.use(requestResponseLogger)

     // All the routes of the api and their respective controller
    app.post("/api/user/signup", signUpUser)
    app.post("/api/user/signin", signInUser)

    // Start Node.js HTTP webapp
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|app listening on ${config.PORT}`)
    })
})()
