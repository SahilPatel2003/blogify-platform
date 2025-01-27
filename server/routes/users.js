const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtKey='mandu';


router.post('/register', async (req, res) => {
    try {
      console.log('hiiiiiiiiiiiiiii');
      const { firstName, lastName, email, password} = req.body;
       const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to register user' });
    }
  });
  
  // User login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({email});
      if(user!='null'){
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if(isPasswordValid){
          
          jwt.sign({ user }, jwtKey,(err,token)=>{
            if(err){
              res.send({result:"something went wrong"})
            }
            res.cookie('token', token, { httpOnly: true });
            res.send({user,auth:token});
          });
        }
        else{
          res.status(401).json({ message: 'Invalid credentials' });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;