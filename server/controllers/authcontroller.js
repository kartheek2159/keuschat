import bcrypt from 'bcrypt'
import UserRepo from '../repos/userrepo.js';
import jwt from 'jsonwebtoken'

const userRepo=new UserRepo();
export const registeruser=async(req,res)=>{
    const {username}=req.body
    try {
        const oldUser =await userRepo.finduser(username);

        if(oldUser){
            return res.status(400).json({message:"Username already registered"})
        }
        const user=await userRepo.createuser(req.body)
        console.log(user)
        const token=jwt.sign({username:user.username,id:user._id},'MERN',{expiresIn:"1h"})
        res.status(200).json({user,token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const loginuser=async(req,res)=>{
    const {username,password}=req.body
    try {
        console.log(username)
        const user=await userRepo.finduser(username);
        console.log(user)
        if(user){
            const validity=await bcrypt.compare(password,user.password)
            if(!validity){
                res.status(400).json("Wrong Password")
            }
            else{
                const token=jwt.sign({username:user.username,id:user._id},'MERN',{expiresIn:"1h"})
                res.status(200).json({user,token})
            }
            
        }
        else{
            res.status(404).json("user doesnot exist")
        }
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}