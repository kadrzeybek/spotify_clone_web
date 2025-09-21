import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
        required: true
    }, //clerk Id
    
    receiverId:{
        type: String,
        required: true,
    }, //clerk ıd
    
    content:{
        type:String,
        required: true,
    },
    
}, {timestamps: true}
)

export const Message = mongoose.model("Message", messageSchema);