//-----------------------------------------------------------------IMPORT---------------------------------------------------------------------------------------------------------

const Campaign = require("../models/campaign");

//---------------------------------------------------LOGIC FOR SVAING CAMPAIGN MESSAGE TO DB------------------------------------------------------------------------------------------------------------

const campaignSaveMSG = async (req, res) =>{

    try{

        const { name, message, group, scheduleTime } = req.body;

        const campaign = await Campaign.create({

            user: req.user.id,

            name,

            message,

            group,
            
            scheduleTime

        });

        res.status(200).json(campaign);

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }
};

//--------------------------------------------------------------GET CAMPAIGN MESSAGE--------------------------------------------------------------------------------------------------------

const getCampaignMSG = async (req, res) =>{

    try{

        const campaign = await Campaign.find({

            user: req.user.id

        }).sort({

            createdAt: -1
        });

        res.status(200).json(campaign);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//-------------------------------------------------------------UPDATE CAMPAIGN MESSAGE------------------------------------------------------------------------------------------------------------

const updateCampaignMSG = async (req, res) =>{

    try{

        const {id} = req.params;

        const {  name, message, group, scheduleTime, status } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(

           id,

           {

             name,
             
             message,

             group,

             scheduleTime,

             status

           },
           {
            new: true
           }

        );

        if(!campaign){

            return res.status(404).json({
                message: "Campaign message not found"
            });
        }

        res.status(200).json(campaign);

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//-------------------------------------------------------------DELETE CAMPAING MESSAGE-------------------------------------------------------------------------------------------------------------

const deleteCampaignMSG = async (req, res) =>{

    try{

        const {id} = req.params;

        const campaign = await Campaign.findByIdAndDelete({

            _id: id,

            user: req.user.id

        });

        if(!campaign){
            
            return res.status(404).json({
                message: "campaign message not found"
            });
        }

        res.status(200).json(campaign)

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};

//------------------------------------------------------------------EXPORT--------------------------------------------------------------------------------------------------------

module.exports = {campaignSaveMSG, getCampaignMSG, updateCampaignMSG, deleteCampaignMSG};