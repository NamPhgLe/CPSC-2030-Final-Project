const mongoose = require("mongoose")

// Making the schema/structure for the user
const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "member" },
    since: { type: Date, default: new Date().toISOString() },
})

const User = mongoose.model("User", userSchema)

module.exports = User;