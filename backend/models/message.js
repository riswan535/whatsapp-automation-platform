//-----------------------------------------------------------------------------------IMPORT-----------------------------------------------------------------------------------------------

const mongoose = require("mongoose");

//--------------------------------------------------------------MESSAGE SCHEMA FOR STORING INCOMING AND OUTGOING MESSAGES---------------------------------------------------------------------------------------

const messageSchema = new mongoose.Schema({

    contact:{
        type: mongoose.Types.ObjectId,
        ref: "CONTACTS",
        required: true
    },

    user:{
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true
    },

    message:{
        type: String,
        required: true
    },

    direction:{
        type: String,
        enum: ["incoming", "outgoing"],
        required: true
    },

    whatsappMessageId:{
        type: String
    },

    status:{
         type: String,
        enum: ["sent", "delivered", "read", "received"],
        default: "sent"
    }
},
{
    timestamps: true
});

const thirty_days =  30 * 24 * 60 * 60;

messageSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: thirty_days }
);

const Message = mongoose.model("MESSAGE", messageSchema);

//-------------------------------------------------------------------------------EXPORTS----------------------------------------------------------------------------------------------------

module.exports = Message;