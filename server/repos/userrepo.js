import usermodel from "../models/usermodel.js";
import bcrypt from 'bcrypt'

class UserRepo{
    async createuser(data){
        const salt=await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(data.password,salt)
        data.password=hashedPass
        const newUser=new usermodel(data)
        const user=await newUser.save()
        return user;
    }
    async finduser(username){
        return usermodel.findOne({username})
    }
}
export default UserRepo