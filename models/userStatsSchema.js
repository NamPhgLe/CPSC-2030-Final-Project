const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
    resumeUploads: { type: Number, default: 0 },
    userCount: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserStats', userStatsSchema);