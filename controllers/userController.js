const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Log = require("../models/reqResLog");


// Signing up user
const signUpUser = async (req, res) => {
    try {
        const { email, password, logId } = req.body;
        // encrypting password
        const encryptedPass = await bcrypt.hash(password, 10)
        const createMember = await User.create({ email, password: encryptedPass });

        // logs
        const logQuery = await Log.findByIdAndUpdate(logId,
            { Query: createMember, Status_Code: "200" }
            , { new: true })

        return res.status(200).json(createMember)   
    }
    catch (err) {
        console.log(err)
        return res.json(400).json(err)
    }

}


const signInUser = async (req, res) => {
    const { logId } = req.body
    try {
        const { email, password } = req.body

        const checkUser = await User.findOne({ email })

        if (!checkUser) {
            const logQuery = await Log.findByIdAndUpdate(logId,
                { Query: "No User Found", Status_Code: "400" }
                , { new: true })
            return res.status(400).json("No User Found")
        }

        const checkPass = await bcrypt.compare(password, checkUser.password)

        if (!checkPass) {
            const logQuery = await Log.findByIdAndUpdate(logId,
                { Query: "Invalid Password", Status_Code: "400" }
                , { new: true })
            return res.status(400).json("Invalid Password")
        }

        const logQuery = await Log.findByIdAndUpdate(logId,
            { Query: checkUser.email, Status_Code: "200" }
            , { new: true })
        return res.status(200).json(checkUser)

    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }

}



module.exports = {
    signUpUser,
    signInUser
}