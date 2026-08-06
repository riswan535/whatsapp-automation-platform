//-----------------------------------------------------------------IMPORT---------------------------------------------------------------------------------------------------

const { MessageTypes } = require("whatsapp-web.js");
const autoReplay = require("../models/autoReplay");

//----------------------------------------------------------FOR SAVING AUTO MESSAGES --------------------------------------------------------------------------------------------------

const creatAautoMesaage = async (req, res) =>{

    try{

        const { group, keyword, replyMessage } = req.body;

        const rule = await autoReplay.create({

            user: req.user.id,

            group,

            keyword: keyword.map(word => word.toLowerCase()),

            replyMessage

        });

        res.status(200).json(rule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

//--------------------------------------------------------GET ALL AUTO REPLAY FROM DB-----------------------------------------------------------------------------------------------

const getAutoReply = async (req, res) =>{

    try{

        const rule = await autoReplay.find({

            user: req.user.id

        }).sort({

            createdAt: -1
            
        });

        res.status(200).json(rule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//------------------------------------------------------------UPDATE AUTO REPLAY----------------------------------------------------------------------------------------------------

const updateAutoReply = async (req, res) =>{

    try{

        const {id} = req.params;

        const { group, keyword, replyMessage, status } = req.body;

        const rule = await autoReplay.findByIdAndUpdate({

            _id: id,
            user: req.user.id
        },
        {
            group,
            keyword,
            replyMessage,
            status
        },
        {
            new: true
        },
    );

    if(!rule){

        return res.status(404).json({
            message: "autoreply not found"
        });
    }

    res.status(200).json(rule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//------------------------------------------------------------DELETE AUTO REPLAY----------------------------------------------------------------------------------------------------

const deleteAutoReply = async (req, res) =>{

    try{
        
        const {id} = req.params;

        const rule = await autoReplay.findByIdAndDelete({

            _id: id,

            user: req.user.id

        });

        if(!rule){

            return res.status(404).json({
                message: "autoreplay not found"
            });
        }

        res.status(200).json(rule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//------------------------------------------------------------------EXPORT-----------------------------------------------------------------------------------------------

module.exports = {creatAautoMesaage, getAutoReply, updateAutoReply, deleteAutoReply};