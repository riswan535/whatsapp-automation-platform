//-----------------------------------------------------------------IMPOTS---------------------------------------------------------------------------------------------------------

const Message = require("../models/message");
const client = require("../services/whatsappService");
const Contact = require("../models/contacts");

//--------------------------------------------------------------------------GET RECIVED CHAT---------------------------------------------------------------------------------------------------------

const getChat = async (req, res) =>{

    try{

        const {contactId} = req.params;

        const message = await Message.find({

            contact: contactId,

            user: req.user.id

        })

        .sort({ createdAt: -1});

        res.status(200).json(message);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//---------------------------------------------------------------------SENT MESSAGE SAVED TO DB-----------------------------------------------------------------------------------------------------

const sentMessage = async (req, res) =>{

    try{

        const {contactId, message} = req.body;

        const contact = await Contact.findById(contactId);

        if(!contact){

            return res.status(404).json({
                message: "contact not found"
            });
        }

        console.log("Sending message...");

        await client.sendMessage(             // [sendMessage] is a built in function in whatsapp-web.js  
            `${contact.phone}@c.us`,
            message
         );

         console.log("Saving to MongoDB...");

         const savedToDb = await Message.create({

            contact: contactId,

            user: req.user.id,

            message,

            direction: "outgoing"

         });

         console.log("Saved successfully");

         res.status(201).json(savedToDb);

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }
};

//---------------------------------------------------------------------------------EXPORTS------------------------------------------------------------------------------------------------

module.exports = {getChat, sentMessage,};