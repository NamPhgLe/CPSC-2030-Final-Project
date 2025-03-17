const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Log = require("../models/reqResLog");
const userStatsSchema = require("../models/userStatsSchema")

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
        
        const updatedStats = await userStatsSchema.findOneAndUpdate(
            {},
            {
                $inc: { userCount: 1}
            },
            { upsert: true, new: true }
        );

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

        checkUser.lastLogin = new Date();
        await checkUser.save();

        await userStatsSchema.findOneAndUpdate(
            {},
            { $inc: { activeUsers: 1 } },
            { upsert: true, new: true }
        );

        const logQuery = await Log.findByIdAndUpdate(logId,
            { Query: checkUser.email, Status_Code: "200" }
            , { new: true })
        return res.status(200).json(checkUser)

    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }

}

const getUserStats = async (req, res) => {
    try {
        // Find the user stats from the database
        const stats = await userStatsSchema.findOne({});

        if (!stats) {
            return res.status(404).json({ error: "No stats found" });
        }

        // Send the userCount as part of the response
        return res.status(200).json({ userCount: stats.userCount });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error fetching stats' });
    }
};

module.exports = {
    signUpUser,
    signInUser,
    getUserStats
}