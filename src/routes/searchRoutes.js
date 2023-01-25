const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.use(requireAuth);

router.post('/searchUser', async(req,res,next)=>{
    const {searchTarget} = req.body;
    try{
        const searchedUserList = await User.find({username:{$regex:searchTarget}},{fullname:1,username:1})
        res.status(200).send({searchedUserList});
    } catch(err){
        return res.status(422).send(err.message)
    }
});

module.exports = router