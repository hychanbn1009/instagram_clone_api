const mongoose = require('mongoose');
require('mongoose-type-url');

const postSchema = new mongoose.Schema({
    photoLink:{
        type:mongoose.SchemaTypes.Url,
        required:true
    },
    postContent:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:{
        type:Number,
        default:0,
        required:true
    },
    likedUser:[{
        type: mongoose.Types.ObjectId,
        ref: "User",
        unique: true
    }],
    timestamp:{
        type: Date,
        default: Date.now,
        required:true
    },
    comments:[{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        unique: true
    }]
})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;