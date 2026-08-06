const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const Group = mongoose.model("GROUP", groupSchema);

module.exports = Group;