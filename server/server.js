(() => {
    const connectToMongo = require("./Utility Module/mongoDBConnect")
    const requestResponseLogger = require("./Utility Module/requestResLogger")
    const { signUpUser, signInUser, signOutUser, getUserStats } = require("../controllers/userController")
    const { checkResumeFile } = require("../controllers/checkerController")
    const homeController = require(`${__dirname}/../controllers/homeController`)
    const memberController = require(`${__dirname}/../controllers/memberController`)
    const config = require(`${__dirname}/config/config`)
    const utils = require(`${__dirname}/utils`)
    const express = require("express")
    const path = require('path');
    const app = express()

    connectToMongo("mongodb+srv://mongo:mongo@cluster2030.9fajz.mongodb.net/");

    
    app.use(express.static(config.ROOT))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use((request, response, next) => {
        utils.logRequest(request)
        next()
    })
    app.use(express.static(path.join(__dirname, 'uploads')));
    app.use(homeController)
    app.use(memberController)

    app.use(requestResponseLogger)

    app.post("/api/user/signup", signUpUser)
    app.post("/api/user/signin", signInUser)
    app.post("/api/user/signout", signOutUser)
    app.get("/api/userStats", getUserStats); 
    app.post('/api/checkResumeFile', checkResumeFile);
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|app listening on ${config.PORT}`)
    })
})()
