import msgmodel from "../models/msgmodel.js";

export const addmsg=async (req,res)=>{
    const {chatid,senderid,text}=req.body;
    const msg=new msgmodel({
        chatid,senderid,text,
    });
    try {
        const result=await msg.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}
export const getmsgs=async(req,res)=>{
    const {chatid}=req.params;
    try {
        const result=await msgmodel.find({chatid})
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}