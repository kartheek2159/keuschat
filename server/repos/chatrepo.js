import chatmodel from "../models/chatmodel.js";

class chatrepo{
    async createchat(data){
        const newchat=new chatmodel({
            members:[data.senderid,data.recieverid],
        });
        return newchat;
    }
    async userchats(data){
        const chat=await chatmodel.find({
            members:{
                $in:[data.userid]
            },
        });
        return chat;
    }
    async findchat(data){
        const chat=await chatmodel.findOne({
            members:{$all:[data.firstid,data.secondid]},
        });
        return chat;
    }
}
export default chatrepo;