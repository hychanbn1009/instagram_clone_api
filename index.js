const express = require('express');
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes");
const requireAuth = require("./src/middlewares/requireAuth");
const postRoutes = require("./src/routes/postRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const searchRoutes = require("./src/routes/searchRoutes");
require('dotenv').config()

const app = express();
app.use(cors());

// all json information pass first then run request handler
app.use(bodyParser.json());
app.use(authRoutes);
app.use(postRoutes);
app.use(accountRoutes);
app.use(commentRoutes);
app.use(searchRoutes);

mongoose.connect("mongodb+srv://admin:passwordpassword@cluster0.c1gcm.mongodb.net/instagram_clone");

mongoose.connection.on('connected',()=>{
    console.log('Connected to Mongo Instance')
});

mongoose.connection.on('error',(err)=>{
    console.log('Error connecting to Mongo',err)
});

app.get("/",requireAuth, (req, res) => res.send("index"));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
