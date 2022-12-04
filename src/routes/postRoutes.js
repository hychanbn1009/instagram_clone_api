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
        res.status(200).send(posts)
    }catch(err){
        return res.status(422).send({error:err.message});
    }
});

module.exports = router