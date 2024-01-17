import chatrepo from "../repos/chatrepo.js";

const crepo=new chatrepo();

export const createchat=async(req,res)=>{
    const newchat=await crepo.createchat(req.body)
    try {
        const nc=await newchat.save()
        res.status(200).json(nc)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userchats=async(req,res)=>{
    try {
        const chat=await crepo.userchats(req.params)
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findchat=async(req,res)=>{
    try {
        const chat=await crepo.findchat(req.params);
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}