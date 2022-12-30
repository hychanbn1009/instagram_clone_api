const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.use(requireAuth);

router.post('/createComment', async(req,res)=>{
    const {authorId,postId,commentContent}=req.body
    if(!authorId || !postId || !commentContent){
        return res.status(422).send({error:'You must provide comment details.'});
    }
    try{
        console.log("create comment")
        const comment = new Comment({postId:postId,author:authorId,commentContent:commentContent})
        await comment.save();
        const targetPost = await Post.findById(postId)
        targetPost.comments.push(comment);
        await targetPost.save();
        const posts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        .populate({
            path : 'comments',
            populate : {path : 'author',select: 'username'}
        })
        let profilePosts =  await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        .populate({
            path : 'comments',
            populate : {path : 'author',select: 'username'}
        })
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        res.status(200).send({
            posts:posts.reverse(),
            profilePosts:profilePosts.reverse()
        })
    } catch(err){
        return res.status(422).send(err.message)
    }
});

module.exports = router