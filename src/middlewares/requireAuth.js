// taking incoming request and do some pre-processing
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
require('dotenv').config();

module.exports = (req,res,next)=>{
    // whenever a request comes into express, it automatically lowercases any header name
    const {authorization} = req.headers;

    // authorization === 'Bearer fdsavbfdewr'
    if(!authorization){
        return res.status(401).send({error:'You must be logged in.'})
    }
    // Replace Bearer with empty string
    const token = authorization.replace('Bearer ','')
    jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
        if(err){
            return res.status(401).send({error:'You must be logged in.'})
        }

        const {userId}=payload;

        const user = await User.findById(userId)
        req.user = user;
        next();
    });
}