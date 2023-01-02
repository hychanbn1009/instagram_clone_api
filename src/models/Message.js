const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    room:{
        type:String,
        required:true
    },
    messageContent:{
        type:String,
        required:true
    },
    timestamp:{
        type: Date,
        default: Date.now,
        required:true
    },
})

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;