const config = require(`${__dirname}/../server/config/config`)
const utils = require(`${__dirname}/../server/utils`)
const util = require(`${__dirname}/../server/util`)
const user = require(`${__dirname}/../models/user`)
const express = require("express")
const bcrypt = require("bcrypt")
const memberController = express.Router()
const Post = require("../server/post")
const client = util.getMongoClient()
let members = []
let authenticated = []

memberController.post('/signup', util.logRequest, async (request, response) => {
    let collection = client.db().collection('members')
    let log = {
        Timestamp: new Date(),
        Method: request.method,
        Path: request.url,
        Query: request.query,
        'Status Code': response.statusCode,
    }
    const { email, password } = request.body
    // console.log(`\t|Password = ${password}`)
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS)
    // console.log(`${password} hash is ${hashed}`)
    const member = user(email, hashed)
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    //console.log(members)
    const isMember = members.filter((m) => m.email === email)[0]
    if (!isMember) {
        members.push(member)
        console.info(members)
        authenticated.push(email)
        //util.insertOne(collection, members[members.length - 1])
        utils.saveJson(config.MEMBERS, JSON.stringify(members))
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `${email} was added successfuly to members.`,
                },
            })
    } else {
        response
            .status(200)
            .json({ error: `${email} already exists. Choose a different email` })
    }
    util.insertOne(collection, log)
})

memberController.post('/signin',util.logRequest, async (request, response) => {
    let collection = client.db().collection('members')
    let log = {
        Timestamp: new Date(),
        Method: request.method,
        Path: request.url,
        Query: request.query,
        'Status Code': response.statusCode,
    }
    const { email, password } = request.body
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    // console.log(members)
    const error = {
        email: email,
        error: `Email or password is incorrect.`,
    }
    const member = members.filter((m) => m.email === email)[0]

    if (!member) {
        response
            .status(200)
            .json(error)
    } else {
        const isMatched = await bcrypt.compare(password, member.hashedPassword);
        if (!isMatched) {
            response
                .status(200)
                .json(error)
        } else {
            response
                .status(200)
                .json({ success: `${email} logged in successfully!` })
            authenticated.push(email)
        }
    }
    util.insertOne(collection, log)
})

memberController.post('/signout',util.logRequest, (request, response) => {
    // console.log('inside /signout')
    let collection = client.db().collection('members')
    let log = {
        Timestamp: new Date(),
        Method: request.method,
        Path: request.url,
        Query: request.query,
        'Status Code': response.statusCode,
    }
    email = request.body.email
    // console.log("authenticated", authenticated)
    authenticated.splice(authenticated.indexOf(email), 1)
    console.log("authenticated", authenticated)
    response
        .status(200)
        .json({
            success: {
                email: email,
                message: `${email} logout successfully.`,
            },
        })
    util.insertOne(collection, log)
})
module.exports = memberController