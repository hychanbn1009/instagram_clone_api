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
            { expiresIn: "120s" }
            );
        res.send({token:token});
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
                { expiresIn: "120s" }
                )
            res.send({token:token,});
        }else{
            return res.status(422).send({error:'Invalid password or email'})
        }
    } catch(err){
        return res.status(422).send({error:'Invalid password or email'})
    }
})

module.exports = router