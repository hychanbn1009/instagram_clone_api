const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.use(requireAuth);

router.post('/create',async (req,res)=>{
    const {photoLink,postContent,username} = req.body;
    console.log(username)
    if(!photoLink){
        return res.status(422).send({error:'You must provide link for the post.'});
    }
    if(!postContent){
        return res.status(422).send({error:'You must provide content for the post.'});
    }
    try{
        const newPost = new Post ({photoLink:photoLink,postContent:postContent,author:req.user._id,username:req.username});
        await newPost.save();
        const posts = await Post.find().populate('author', 'username')
        let profilePosts =  await Post.find().populate('author', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        console.log(profilePosts)
        res.status(200).send({
            posts:posts.reverse(),
            profilePosts:profilePosts.reverse()
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
});

router.get('/',async (req,res)=>{
    try{
        const posts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        res.status(200).send(posts.reverse())
    }catch(err){
        return res.status(422).send({error:err.message});
    }
});

router.get('/:username', async(req,res)=>{
    const username=req.params.username
    try{
        let profilePosts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        let profileUser = await User.find({"username":username},{username:1,followers:1,followers:1,following:1}).select()
        .populate('followers', 'username')
        .populate('following', 'username')
        res.status(200).send({
            profilePosts:profilePosts.reverse(),
            profileUser:profileUser
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.post('/profile', async(req,res)=>{
    const userId=req.body._id
    try{
        const profilePosts = await Post.find({"author":userId})
        .populate('followers', 'username')
        .populate('following', 'username')
        res.status(200).send(profilePosts)
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.get('/:id', async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        await Post.findByIdAndRemove(req.params.id)
        res.status(200).send("Deleted!")
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.put('/:id', async(req,res)=>{
    try{
        await Post.findByIdAndUpdate(req.params.id,{
            postContent:req.body.postContent,
        })
        res.status(200).send("Changed!")
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.delete('/:username/:postId', async(req,res)=>{
    try{
        const username=req.params.username
        const postId=req.params.postId
        await Post.findByIdAndRemove(postId)
        let profilePosts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        res.status(200).send(profilePosts.reverse())
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.put('/:username/:postId', async(req,res)=>{
    try{
        const username=req.params.username
        const postId=req.params.postId
        const {postContent} = req.body;
        await Post.findByIdAndUpdate(postId,{
            postContent:postContent,
        })
        let profilePosts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        res.status(200).send(profilePosts.reverse())
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.post('/like', async(req,res)=>{
    try{
        const postId=req.body.postId
        const username=req.body.username
        const userId = await User.find({"username":username},'_id')
        console.log("like")
        await Post.findByIdAndUpdate(postId,{
            $addToSet:{likedUser:userId}
        })
        const posts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        let profilePosts =  await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        res.status(200).send({
            posts:posts.reverse(),
            profilePosts:profilePosts.reverse()
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.post('/unlike', async(req,res)=>{
    try{
        const postId=req.body.postId
        const username=req.body.username
        const userId = await User.find({"username":username},'_id')
        console.log("unlike")
        await Post.findByIdAndUpdate(postId,{
            $pullAll:{likedUser:userId}
        })
        const posts = await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        let profilePosts =  await Post.find()
        .populate('author', 'username')
        .populate('likedUser', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        res.status(200).send({
            posts:posts.reverse(),
            profilePosts:profilePosts.reverse()
        })
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

module.exports = router