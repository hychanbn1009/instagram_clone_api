const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');
const Message = require("../models/Message");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const router = express.Router();

router.use(requireAuth);

router.post('/getMessageHistory', async(req,res,next)=>{
    const {room} = req.body;
    try{
        const messageHistory =  await Message.find({room:room})
        .populate('sender', 'username')
        res.status(200).send({messageHistory});
    } catch(err){
        return res.status(422).send(err.message)
    }
});

module.exports = router