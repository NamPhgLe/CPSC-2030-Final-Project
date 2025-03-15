const Log = require("../../models/reqResLog")

const requestResponseLogger = async (req, res, next) => {
    try {
        const log = await Log.create({
            Method: req.method,
            Path: req.path,
        })
        req.body = { ...req.body, logId: log._id }
        next();

    }
    catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }

}

module.exports = requestResponseLogger