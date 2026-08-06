//----------------------------------------------------------IMPORTS-----------------------------------------------------------------------------------------------------

const User = require("../models/user");
const {userApprovalEmail} = require("../services/emailService");
const Contact = require("../models/contacts");
const Campaign = require("../models/Campaign");
const ScheduleMessage = require("../models/scheduleMessage");
const AutoReply = require("../models/autoReplay");
const Message = require("../models/message");
const Group = require("../models/Group");

//---------------------------------------------------------API FOR GET ALL USERS-------------------------------------------------------------------------------------
const getUsers =  async (req, res) =>{

    try{

        const users = await User.find({

            role: "user"

        });

        res.status(200).json(users);

    }catch(error){

         res.status(500).json({
            message: error.message
        });
        
        }

}    
//---------------------------------------------------------API FOR APPROVING USER----------------------------------------------------------------------------------------

const approveUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findByIdAndUpdate(

            id,

            {
                isApproved: true
            },

            {
                new: true
            }

        );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        await userApprovalEmail(

            user.name,
            user.email
        )

        res.status(200).json({
            message: "User approved successfully"
        });

        
    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//----------------------------------------------------------API FOR DELETING USER---------------------------------------------------------------------------------------------

const deleteUser = async (req, res) =>{

    try{

        const { id } = req.params;

         const user = await User.findById(id);

         if(!user){

            return res.status(404).json({
                message: "user not found"
            });
         }

           // Delete all user data

        await Contact.deleteMany({
            user: id
        });

        await Campaign.deleteMany({
            user: id
        });

        await ScheduleMessage.deleteMany({
            user: id
        });

        await AutoReply.deleteMany({
            user: id
        });

        await Message.deleteMany({
            user: id
        });

        // Add after Group feature is created
        await Group.deleteMany({
            user: id
        });

        // Finally delete user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User and all related data deleted successfully"
        });

    }catch(error){

        res.status(500).json({
            message: error.message
        });
    }
}

//-------------------------------------------------------------ADMIN DASHBOARD------------------------------------------------------------------------------------

const adminDashBoard = async (req, res) =>{

    try{

        const totalUsers = await User.countDocuments({

            role: "user"

        });

        const pendingUsers = await User.countDocuments({

            isApproved: false,

            role: "user"

        });

        const approvedUser = await User.countDocuments({

            isApproved: true,

            role: "user"

        });

        res.status(200).json({

            totalUsers,
            
            pendingUsers,

            approvedUser

        });

    }catch(error){

        res.status(500).json({
            message: error.message
        });

    }
};




//-----------------------------------------------------------------EXPORTS-------------------------------------------------------------------------------------------------------

module.exports = {getUsers, approveUser, deleteUser, adminDashBoard};