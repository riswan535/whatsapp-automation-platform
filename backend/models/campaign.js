//---------------------------------------------------------------------------------IMPORT---------------------------------------------------------------------------------------------------------------

const mongoose = require("mongoose");

//-------------------------------------------------------------------------SCHEMA FOR CAMPAIGN SCHEDULE---------------------------------------------------------------------------------------------------------------

const campaignSchema = new mongoose.Schema({


    user:{
        type: mongoose.Types.ObjectId,
        ref: "USER"
    },

    name: String,

    group:{
        type: mongoose.Types.ObjectId,
        ref: "GROUP",
        required: true
    },

    message: String,

    scheduleTime: Date,

    status:{
        type: String,
        enum: ["pending", "running", "completed"],
        default: "pending"
    },

    sentCount:{
        type: Number,
        default: 0
    },

     deleteAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
);

campaignSchema.index(
    { deleteAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports =
    mongoose.models.CAMPAIGN ||
    mongoose.model("CAMPAIGN", campaignSchema);