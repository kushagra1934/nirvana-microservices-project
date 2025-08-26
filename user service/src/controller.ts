import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import TryCatch from "./TryCatch.js";
import { User } from "./model.js";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "./middleware.js";

export const registerUser = TryCatch(async (req, res) => {

    //read the name, email, password from the body of the request
  const { name, email, password } = req.body;

  //find that particular user in the database using the email
  let user = await User.findOne({
    email,
  });

  //if the user exists already, send a 400 response with user already exists message
  if (user) {
    res.status(400).json({
      message: "User already exists",
    });

    return;
  }

  //if not exists, then hash the password from the req body using bcrypt
  const hashPassword = await bcrypt.hash(password, 10);


  //create a new user in the database with the name, email and *hashed password*
  user = await User.create({
    name,
    email,
    password: hashPassword,
  });


  //generate a jwt token for that user using the user id and JWT_SEC (expires in 7 days)
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  //success message with the user and token
  res.status(201).json({
    message: "User registered successfully",
    user,
    token
  })
});



export const loginUser=TryCatch(async(req,res)=>{

    //read email and password from the request body
    const {email,password}=req.body;
    const user = await User.findOne({
        email
    });

    

    //if there is no user with that email then send user not exists
    if(!user){
        res.status(404).json({
            message:"User not exists",
        });
        return;
    }


    //if the user exists, compare the password from the request body and the hashed password in db using bcrpyt
    const isMatch=await bcrypt.compare(password,user.password);


    //if the password does not match, then send invalid password
    if(!isMatch){
        res.status(400).json({
          message: "Invalid Password",
        });
        return;
    }


    //again sign a token if the user is logged in successfully
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
      expiresIn: "7d",
    });


    //success message with user and token
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });





})    



//get the profile of the logged in user using the isAuth middleware
export const myProfile=TryCatch(async(req:AuthenticatedRequest,res:Response)=>{
    const user= req.user;
    res.json(user);
})