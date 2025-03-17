const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
    userCount: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    resumeUploads: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserStats', userStatsSchema);