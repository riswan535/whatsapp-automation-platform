//-----------------------------------------------------IMORTS--------------------------------------------------------------------------------------------------

const mongoose = require("mongoose");

//-----------------------------------------------------CREATING SCHEMA - USER-----------------------------------------------------------------------------------

const userSchema = new mongoose.Schema(

{
    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
    },

    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    isApproved:{
        type: Boolean,
        default: false
    },

    whatsappConnected:{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}

);

const User = mongoose.model("USER", userSchema);

//-------------------------------------------------------------EXPORTS---------------------------------------------------------------------------------------------

module.exports = User;