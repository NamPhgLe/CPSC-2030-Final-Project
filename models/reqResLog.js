const mongoose = require('mongoose')

// Making the schema/structure for the log
const logSchema = mongoose.Schema({
    TimeStamp: { type: String, default: new Date().toISOString() },
    Method: { type: String, required: true },
    Path: { type: String, required: true },
    Query: { type: Object, default: {} },
    Status_Code: { type: String, default: "" }
})

const Log = mongoose.model("Log", logSchema)

module.exports = Log