const UserStats = (resume, count, active) => {
    return {
        resumeUploads: resume,
        userCount: count,
        activeUsers: active
    }
} 

module.exports = UserStats;