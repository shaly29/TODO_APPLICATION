
require("dotenv").config();
const asyncHandler=require('express-async-handler');
const generateToken= require('../utils/generateToken');
const User = require('../models/user')

const mongoose = require('mongoose');



// @desc register user/set token
// route POST /api/users/signup
//  if you are not our user so  New User Registation 
// @access Public


const registerUser = asyncHandler (async (req, res) =>{
  const { name, email, password} = req.body;
  
  const userExists = await User.findOne({ email });
  
  if (userExists) {
      res.status(400);
      throw new Error('User already exists');
  }
  
  const user = await User.create({
      name,
      email,
      password,
     
  });
  
  if (user) {
      generateToken(res, user._id);
      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
        
          success:true, 
          message :"welcome" 
      });
  
   
    }else{
        res.status(200)
        throw new Error ("Invaild data")
    }
  }); 
  
// @desc Auth user/set token  
// route POST/ api/users/login
//  you are alredy sign up so now you are login
// @access Public


const authUser = asyncHandler (async (req, res) =>{
  const { email, password } = req.body;
  
  const user = await User.findOne({ email});
  
  if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
    

      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.token,

          success:true, 
          message :"Welcome to TODO APP"
      });
  } else {
      res.status(401);
      throw new Error('Invalid email or password');
  }
  
  });
// @desc logout user/set token
// route POST /api/users/logout
// logout your account 
// User LogOut
// @access Public
const logoutUser = asyncHandler(async(req, res) => {

  res.cookie('jwt','',{ 
      httpOnly:true, 
      expires: new Date(0),
  })
  res.status (200).json ({ message: 'User logged out successfully'});
  });
  

// @desc GetAllusers
// route Patch /api/users/getalluser
// @access Private

      const getAllUser = asyncHandler(async (req, res) => {
          const user= await User.find({});
          res.json(user);
        });
       
 
// @desc delete user
// route GET /api/users/id
// @access Private

      const deleteUser = async (req, res) => {
        try {
          const userId = req.params.id;
      
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
          }
      
          const updatedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
      
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.json({ message: 'User marked as deleted in admin panel', user: updatedUser });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
    
    module.exports = {
        authUser,
        registerUser,
        logoutUser,
         getAllUser,
       
        deleteUser 
    }





