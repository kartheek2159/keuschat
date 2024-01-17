import mongoose from "mongoose";

const msgschema=mongoose.Schema({
    chatid:{
        type:String,
    },
    senderid:{
        type:String,
    },
    text:{
        type:String,
    }
},{
    timestamps:true,
})

const msgmodel=mongoose.model("messages",msgschema)
export default msgmodel