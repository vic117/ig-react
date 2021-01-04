const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.get('/',(req,res)=>{
    res.send("hello from router");
});
router.get('/protected',requireLogin,(req, res)=>{
    res.send("hello user");
})
router.post('/signup',(req, res)=>{
    console.log(req.body);
    const {name,email,password} = req.body;
    if(!email || !password || !name){
        res.status(422).json("Please fill all the fields");
    }
    User.findOne({email:email})
        .then((savedUser) => {
            if(savedUser){
                res.status(422).json("User already exists with that email");
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    email,
                    password:hashedpassword, 
                    name
                });
                user.save()
                .then(user => {
                    res.json({message:"saved successfully"});
                })
                .catch(err=>{
                    console.log(err);
                })
                
            })


        })
        .catch(err=>{
            console.log(err);
        })
    //res.status(200).json({message:"Successfully signed up"});
})
router.post('/signin', (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
       return res.status(422).json({errror:"Please provide the correct user or password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
          return  res.status(422).json({error:"invalid user or password"});
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully logged"});
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
                res.json({token});
            }
            else{
                return res.status(422).json({error:"Invalid password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})
module.exports = router;