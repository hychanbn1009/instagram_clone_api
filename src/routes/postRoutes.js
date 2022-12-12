const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.use(requireAuth);

router.post('/',async (req,res)=>{
    const {photoLink,postContent} = req.body;
    if(!photoLink){
        return res.status(422).send({error:'You must provide link for the post.'});
    }
    if(!postContent){
        return res.status(422).send({error:'You must provide content for the post.'});
    }
    try{
        const post = new Post ({photoLink:photoLink,postContent:postContent,author:req.user._id,username:req.user.username});
        await post.save();
        res.status(200).send(post)
    }catch(err){
        return res.status(422).send({error:err.message});
    }
});

router.get('/',async (req,res)=>{
    try{
        const posts = await Post.find().populate('author', 'username')
        res.status(200).send(posts.reverse())
    }catch(err){
        return res.status(422).send({error:err.message});
    }
});

// router.get('/profile', async(req,res)=>{
//     const userId=req.body._id
//     try{
//         const profilePosts = await Post.find({"author":userId})
//         res.status(200).send(profilePosts)
//     }catch(err){
//         return res.status(422).send({error:err.message});
//     }
// })

router.get('/:username', async(req,res)=>{
    const username=req.params.username
    try{
        let profilePosts = await Post.find().populate('author', 'username')
        profilePosts = profilePosts.filter(post=>{
            if (post.author.username==username){
                return post
            }
        })
        console.log(profilePosts)
        res.status(200).send(profilePosts)
    }catch(err){
        return res.status(422).send({error:err.message});
    }
})

router.post('/profile', async(req,res)=>{
    const userId=req.body._id
    try{
        const profilePosts = await Post.find({"author":userId})
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

module.exports = router