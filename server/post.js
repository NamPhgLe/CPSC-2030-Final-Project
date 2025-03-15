const Post = (code, method) => {
    return {
        'Timestamp': new Date().toUTCString(),
        'Method': method,
        'Path': "/posts",
        'Query' : Object,
        'Status Code': code
        
    }
}
module.exports = Post
