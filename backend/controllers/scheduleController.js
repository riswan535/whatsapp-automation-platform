//----------------------------------------------------------------IMPORT------------------------------------------------------------------------------------------

const scheduleMessage = require("../models/scheduleMessage");

//-------------------------------------------------------------CREATE SCHEDULE---------------------------------------------------------------------------------------------------

const createSchedule = async (req, res) =>{

    try{

        console.log("REQ USER:", req.user);

        const {contactId, message, scheduleTime} = req.body;

        const schedule = await scheduleMessage.create({

            contact: contactId,

            user: req.user.id,

            message,

            scheduleTime

        });

        res.status(200).json(schedule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};
//-----------------------------------------------------------GET SCHEDULE FROM DB---------------------------------------------------------------------------------------------

const getSchedule = async (req, res) =>{

    try{

        const schedule = await scheduleMessage.find({
            
            user: req.user.id

        }).sort({

            createdAt: -1
            
        });

        res.status(200).json(schedule);
        
    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//---------------------------------------------------------------UPDATE SCHEDULE------------------------------------------------------------------------------------------------

const updateSchedule = async (req, res) =>{

    try{

        const {id} = req.params;

        const { contactId, message, scheduleTime, status } = req.body;

        const schedule = await scheduleMessage.findByIdAndUpdate(

            {
                _id: id,

                user: req.user.id
            },
            {
                contactId,

                message,

                scheduleTime,

                status

            },
            {
                new: true
            }
        );

        if(!schedule){
            
            return res.status(404).json({
                message: "schedule not found"
            });
        }

        res.status(200).json(schedule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }
};

//---------------------------------------------------------------DELETE SCHEDULE------------------------------------------------------------------------------------------------

const deleteSchedule = async (req, res) =>{

    try{

        const {id} = req.params;

        const schedule = await scheduleMessage.findByIdAndDelete({

            _id: id,

            user: req.body.user
            
        });

        if(!schedule){

            return res.status(404).json({
                message: "schedule not found"
            });
        }

        res.status(200).json(schedule);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//------------------------------------------------------------------EXPORT---------------------------------------------------------------------------------------------

module.exports = { createSchedule, getSchedule, updateSchedule, deleteSchedule };