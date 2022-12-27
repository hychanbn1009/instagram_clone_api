const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required:true
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    commentContent:{
        type:String,
        required:true
    },
    timestamp:{
        type: Date,
        default: Date.now,
        required:true
    },
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;