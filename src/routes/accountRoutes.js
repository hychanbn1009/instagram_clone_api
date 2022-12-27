const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.use(requireAuth);

router.post('/follow', async(req,res)=>{
    try{
        console.log("follow")
        const {username,targetUser}=req.body;
        const usernameId = await User.find({"username":username},'_id')
        const targetUserId = await User.find({"username":targetUser},'_id')
        console.log(username,usernameId)
        console.log(targetUser,targetUserId)
        await User.findByIdAndUpdate(targetUserId,{
            $addToSet:{followers:usernameId}
        })
        await User.findByIdAndUpdate(usernameId,{
            $addToSet:{following:targetUserId}
        })
        let profileUser = await User.find({"username":targetUser},{username:1,followers:1,followers:1,following:1}).select()
        .populate('followers', 'username')
        .populate('following', 'username')
        let profilePosts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==targetUser){
                return post
            }
        })
        res.status(200).send({
            profilePosts:profilePosts.reverse(),
            profileUser:profileUser
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.post('/unfollow', async(req,res)=>{
    try{
        console.log("unfollow")
        const {username,targetUser}=req.body;
        const usernameId = await User.find({"username":username},'_id')
        const targetUserId = await User.find({"username":targetUser},'_id')
        console.log(username,usernameId)
        console.log(targetUser,targetUserId)
        await User.findByIdAndUpdate(targetUserId,{
            $pullAll:{followers:usernameId}
        })
        await User.findByIdAndUpdate(usernameId,{
            $pullAll:{following:targetUserId}
        })
        let profileUser = await User.find({"username":targetUser},{username:1,followers:1,followers:1,following:1}).select()
        .populate('followers', 'username')
        .populate('following', 'username')
        let profilePosts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==targetUser){
                return post
            }
        })
        res.status(200).send({
            profilePosts:profilePosts.reverse(),
            profileUser:profileUser
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

module.exports = router