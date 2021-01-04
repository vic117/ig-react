const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
PORT = 5000;
//------Model---
require('./models/user');
//__> call from model: mongoose.model("User");
app.use(express.json());

//routes connection
app.use(require('./routes/auth'));
//mongodb connection
mongoose.connect(MONGOURI,
    {useNewUrlParser: true,
    useUnifiedTopology: true});
mongoose.connection.on('connected', ()=>{
    console.log("Connected to Mongo Yeah!");
});
mongoose.connection.on('error', (err)=>{
    console.log("error while connecting", err);
});

//express connection at port 5000
app.listen(PORT, ()=>{
    console.log("server is running on", PORT);
})