//-------------------------------------------------------------------------------IMPORTS------------------------------------------------------------------------------------------------------

const scheduleMessage = require("../models/scheduleMessage");
const Message = require("../models/message");
const Contact = require("../models/contacts");
const {getClient} = require("../services/whatsappService");
const { schedule } = require("node-cron");
const { search } = require("../route/messageRoutes");

//---------------------------------------------------------------FUNCTION FOR SENDING SCHEDULED MESSAGES FROM DB----------------------------------------------------------------------------------------------------------

const sentScheduledMSG = () =>{

    setInterval(async () =>{

        try{

            const schedules = await scheduleMessage.find({

            status: "pending",

            scheduleTime: {$lte: new Date()}

        });

        console.log("Checking schedules...");

        console.log("Found schedules:", schedules.length);

         console.log("Current Time:", new Date());

        for(const schedule of schedules){

            console.log("Schedule Found:", schedule);

            const contact = await Contact.findById(schedule.contact);

            console.log("Contact:", contact);

            if(!contact) {

                   console.log("Contact not found");

                   continue;
            }

            const client = getClient();
            
            await client.sendMessage(

                `${contact.phone}@c.us`,
                schedule.message

            );

            await Message.create({

                contact: schedule.contact,

                user: schedule.user,

                message: schedule.message,

                direction: "outgoing",

                status: "sent"

            });

            schedule.status = "sent";

            await schedule.save();

            console.log("schedule message sent");

        }

        }catch(error){

            console.log(error.message);
        }

    },3000)

}

//-------------------------------------------------------------------------------EXPORTS-----------------------------------------------------------------------------------------------------

module.exports = sentScheduledMSG;