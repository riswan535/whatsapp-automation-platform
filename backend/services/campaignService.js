//--------------------------------------------------------------- IMPORTS -----------------------------------------------------------------------------------------------

const Campaign = require("../models/Campaign");
const Contact = require("../models/contacts");
const Message = require("../models/message");
const {getClient} = require("./whatsappService");

//---------------------------------------------------------------- SERVICE ------------------------------------------------------------------------------------------

const runCampaigns = () => {

    setInterval(async () => {

        try {

            const campaigns = await Campaign.find({

                status: "pending",

                scheduleTime: { $lte: new Date() }

            });

            console.log("Checking campaigns...");

            console.log("Found campaigns:", campaigns.length);

            for (const campaign of campaigns) {

                console.log("Running campaign:", campaign.name);

                campaign.status = "running";

                await campaign.save();

                const contacts = await Contact.find({

                    user: campaign.user,

                    group: campaign.group

                });

                console.log("Contacts found:", contacts.length);

               for (const contact of contacts) {

    try {

        const client = getClient();

        if (!client) {
            console.log("WhatsApp client not initialized");
            continue;
        }

        await client.sendMessage(
            `${contact.phone}@c.us`,
            campaign.message
        );

        await Message.create({
            contact: contact._id,
            user: campaign.user,
            message: campaign.message,
            direction: "outgoing",
            status: "sent"
        });

        campaign.sentCount += 1;

        console.log(`Message sent to ${contact.phone}`);

    } catch (error) {

        console.log(
            `Failed for ${contact.phone}:`,
            error.message
        );

    }

}

                campaign.status = "completed";

                await campaign.save();

                console.log(

                    `Campaign completed. Total sent: ${campaign.sentCount}`

                );

                campaign.status = "completed";

                 campaign.deleteAt = new Date(
                 Date.now() + 30 * 24 * 60 * 60 * 1000
                );

                 await campaign.save();

                 console.log(
                  `Campaign completed. Total sent: ${campaign.sentCount}`
                );

            }
            

        } catch (error) {

            console.log(error.message);

        }

    }, 5000);

};

//---------------------------------------------------------------- EXPORT -------------------------------------------------------------------------------------

module.exports = runCampaigns;