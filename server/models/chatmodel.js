import mongoose from "mongoose";

const chatschema= mongoose.Schema(
    {
        members:{
            type:Array,
        }
    },{
        timestamps:true
    }
);
const chatmodel=mongoose.model("chat",chatschema)
export default chatmodel