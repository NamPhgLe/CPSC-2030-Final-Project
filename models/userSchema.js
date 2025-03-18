const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "member" },
    online: {type: Boolean, default: false},
    since: { type: Date, default: new Date().toISOString() },
})

const User = mongoose.model("User", userSchema)

module.exports = User;