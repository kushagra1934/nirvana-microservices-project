import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import TryCatch from "./TryCatch.js";
import { User } from "./model.js";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "./middleware.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({
    email,
  });

  if (user) {
    res.status(400).json({
      message: "User already exists",
    });

    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res.status(201).json({
    message: "User registered successfully",
    user,
    token
  })
});



export const loginUser=TryCatch(async(req,res)=>{
    const {email,password}=req.body;
    const user = await User.findOne({
        email
    });

    


    if(!user){
        res.status(404).json({
            message:"User not exists",
        });
        return;
    }


    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        res.status(400).json({
          message: "Invalid Password",
        });
        return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });





})    



export const myProfile=TryCatch(async(req:AuthenticatedRequest,res:Response)=>{
    const user= req.user;
    res.json(user);
})