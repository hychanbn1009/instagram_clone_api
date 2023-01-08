const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');
const User = require('../models/User');
const Message = require("../models/Message");
const { instrument } = require("@socket.io/admin-ui");
const io = require ('socket.io')(process.env.PORT || 4000,{
    cors:{
        origin: "*"
    }
});

module.exports = io.on('connection', socket=>{
    socket.on("join-room",(room)=>{
        {console.log(`join room ${room}`)}
        socket.join(room)
        Message.find({room:room})
        .populate('sender', 'username')
        .then(history=>{
            {console.log(`emit chat history`)}
            socket.emit('get-chat-history',history.reverse())
        })
    })
    socket.on("send-message",async(message,room,userId)=>{
        try{
            {console.log(message)}
            const msg = new Message({sender:userId,messageContent:message,room:room})
            await msg.save()
            socket.broadcast.to(room).emit('receive-message',message)
        }catch(err){
            console.log(err)
        }
    })
})

instrument(io, {
    auth: false
});

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