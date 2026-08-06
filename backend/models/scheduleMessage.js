//-----------------------------------------------------------IMPORTS------------------------------------------------------------------------------------------------------

const mongoose = require("mongoose");

//---------------------------------------------------SCHEMA FOR SCHEDULE MESSAGE --------------------------------------------------------------------------------------------------------

const scheduleSchema = new mongoose.Schema({

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

    scheduleTime:{
        type: Date,
        required: true
    },

    status:{
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending"
    }
},
{
    timestamps: true
}
);

const scheduleMessage = mongoose.model("SCHEDULE", scheduleSchema); 

//------------------------------------------------------------EXPORTS----------------------------------------------------------------------------------------------------------

module.exports = scheduleMessage;