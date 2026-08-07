//--------------------------------------------------------------IMPORT-------------------------------------------------------------------------------------------------------

const Contacts = require("../models/contacts");
const Campaign = require("../models/campaign");
const ScheduleMessage = require("../models/scheduleMessage");
const AutoReplay = require("../models/autoReplay");
const Message = require("../models/message");

//--------------------------------------------------------DASHBOARD FOR FEATCH COUNTS--------------------------------------------------------------------------------------------------------

const dashBoard = async (req, res) =>{

    try{

        const totalContacts = await Contacts.countDocuments({
            
            user: req.user.id
        });

        const totalCampaign = await Campaign.countDocuments({

            user: req.user.id
        });

        const pendingCampaign = await Campaign.countDocuments({
            
            user: req.user.id,
            status: "pending"
        });

        const completedCampaign = await Campaign.countDocuments({

            user: req.user.id,
            status: "completed"
        });

        const totalSchedule = await ScheduleMessage.countDocuments({

            user: req.user.id
        });

        const pendingSchedule = await ScheduleMessage.countDocuments({

            user: req.user.id,
            status: "pending"
        });

        const completedSchedule = await ScheduleMessage.countDocuments({

            user: req.user.id,
            status: "sent"
        })

        const totalAutoReplay = await AutoReplay.countDocuments({

            user: req.user.id
        });

        const liveAutoReplay = await AutoReplay.countDocuments({

            user: req.user.id,
            status: true
        });

        const incommingMSG = await Message.countDocuments({

            user: req.user.id,
            direction: "incoming"
        });

        const outgoingMSG = await Message.countDocuments({

            user: req.user.id,
            direction: "outgoing"
        });

        res.status(200).json({

            totalContacts,

            totalCampaign,

            pendingCampaign,

            completedCampaign,

            totalSchedule,

            pendingSchedule,

            completedSchedule,

            totalAutoReplay,

            liveAutoReplay,

            incommingMSG,

            outgoingMSG

        });

    }catch(error){

        res.status(500).json({
            Message: error.message
        });

    }
};

//------------------------------------------------------------------EXPORTS---------------------------------------------------------------------------------------------------

module.exports = dashBoard;