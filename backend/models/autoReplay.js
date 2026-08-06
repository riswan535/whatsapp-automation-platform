//-----------------------------------------------------------------IMPORTS------------------------------------------------------------------------------------------------

const mongoose = require("mongoose");

//----------------------------------------------------------MODEL FOR AUTO REPLAY--------------------------------------------------------------------------------------------------

const autoReplaySchema = new mongoose.Schema({

    user:{
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true
    },

   group:{
        type: mongoose.Types.ObjectId,
        ref: "GROUP",
        required: true
    },

    keyword:[{
        type: String
    }],

    replyMessage:{
        type: String,
        required: true
    },

    status:{
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

const autoReplay = mongoose.model("AUTOREPLAY", autoReplaySchema);

//-----------------------------------------------------------------EXPORTS--------------------------------------------------------------------------------------------------

module.exports = autoReplay;