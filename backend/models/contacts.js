const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    group: {
        type: mongoose.Types.ObjectId,
        ref: "GROUP",
        default: null
    },

    source: {
        type: String,
        enum: ["manual", "whatsapp"],
        default: "manual"
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true
    }

}, {
    timestamps: true
});

const Contacts =
    mongoose.models.CONTACTS ||
    mongoose.model("CONTACTS", contactSchema);

module.exports = Contacts;