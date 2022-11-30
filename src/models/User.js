const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    fullname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

userSchema.pre('save',function(next){
    const user = this;
    // only hash the password if it has been modified
    if (!user.isModified('password')){
        return next();
    }
    // generate a salt
    bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR,10),function(err,salt){
        if (err){
            return next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err){
                return next(err);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    })
})

const User = mongoose.model('User',userSchema);

module.exports = User;