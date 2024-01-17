import mongoose from "mongoose";

const userschema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   

}, {
    timestamps:true
})
const usermodel=mongoose.model("users",userschema)
export default usermodel