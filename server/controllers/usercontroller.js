import usermodel from "../models/usermodel.js";

export const getallusers=async (req,res)=>{
    try {
        let users=await usermodel.find();
        console.log(users)
        users=users.map((user)=>{
            const {password,...other}=user._doc
            return other;
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}