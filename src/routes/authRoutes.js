const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const router = express.Router();

router.post('/register', async(req,res,next)=>{
    const {email,fullname,username,password} = req.body;
    try{
        const user = new User({email,username,fullname,password});
        await user.save();
        // create jwt and encode
        const token = jwt.sign({userId:user._id},
            process.env.JWT_SECRET_KEY,
            // { expiresIn: "120s" }
            );
        const userInfo = await User.findOne({email:email},{password:0})
        .populate('followers', 'username')
        .populate('following', 'username')
        res.status(200).send({token:token,user:userInfo});
    } catch(err){
        // send invaild data to server
        return res.status(422).send(err.message)
    }
});

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(422).send({error:'Must provide email and password'})
    }
    const user = await User.findOne({email:email})
    console.log(user)
    if(!user){
        return res.status(422).send({error:'Email not found'})
    }
    try{
        const match = await bcrypt.compare(password, user.password);
        if(match) {
            const token = jwt.sign(
                {userId:user._id}, 
                process.env.JWT_SECRET_KEY,
                // { expiresIn: "120s" }
                )
            // res.status(200).send({token:token,userId:user.id,username:user.username,followers:user.followers});
            const userInfo = await User.findOne({email:email},{password:0})
            .populate('followers', 'username')
            .populate('following', 'username')
            res.status(200).send({token:token,user:userInfo});
        }else{
            return res.status(422).send({error:'Invalid password or email'})
        }
    } catch(err){
        return res.status(422).send({error:'Invalid password or email'})
    }
})

router.post('/updateUser', async(req,res)=>{
    const username=req.body.username
    console.log(username)
    try{
        console.log("updateUser")
        const userInfo = await User.find({"username":username},{password:0})
        .populate('followers', 'username')
        .populate('following', 'username')
        res.status(200).send({user:userInfo});
    } catch(err){
        return res.status(422).send(err.message)
    }
});

module.exports = router