//-------------------------------------------------------------IMPORTS-------------------------------------------------------------

const Contact = require("../models/contacts");
const { getClient } = require("./whatsappService");

//---------------------------------------------------------SYNC CONTACTS----------------------------------------------------------

const syncContacts = async (userId) => {

    console.log("USER ID =", userId);

    const client = getClient();

    console.log("Client exists:", !!client);
    console.log("Client info:", client?.info);

    if (!client) {
        throw new Error("WhatsApp Client Not Initialized");
    }

    if (!client.info) {
        throw new Error("WhatsApp is still reconnecting. Please wait.");
    }

    //----------------------------------------------------------
    // Client Status
    //----------------------------------------------------------

    console.log("Puppeteer Page Exists:", !!client.pupPage);
    console.log("Browser Exists:", !!client.pupBrowser);
    console.log("Page Closed:", client.pupPage?.isClosed());
    console.log("State:", await client.getState());

    //----------------------------------------------------------
    // Get WhatsApp Contacts
    //----------------------------------------------------------

    console.log("Loading WhatsApp Contacts...");

    const contacts = await client.getContacts();

    console.log("Contacts Loaded:", contacts.length);

    let saved = 0;
    let skipped = 0;

    //----------------------------------------------------------
    // Loop Contacts
    //----------------------------------------------------------

    for (const waContact of contacts) {

        try {

            //--------------------------------------------------
            // Skip Groups
            //--------------------------------------------------

            if (waContact.isGroup) continue;

            //--------------------------------------------------
            // Skip invalid contacts
            //--------------------------------------------------

            if (!waContact.id?.user) continue;

            //--------------------------------------------------
            // Phone
            //--------------------------------------------------

            const phone = waContact.id.user;

            //--------------------------------------------------
            // Ignore WhatsApp system contacts
            //--------------------------------------------------

            if (
                phone === "status" ||
                phone === "0"
            ) {
                continue;
            }

            //--------------------------------------------------
            // Name
            //--------------------------------------------------

            const name =
                waContact.pushname ||
                waContact.name ||
                waContact.shortName ||
                phone;

            //--------------------------------------------------
            // Already Exists?
            //--------------------------------------------------

            const exists = await Contact.findOne({
                phone,
                user: userId
            });

            if (exists) {
                skipped++;
                continue;
            }

            //--------------------------------------------------
            // Save Contact
            //--------------------------------------------------

            await Contact.create({

                name,

                phone,

                group: null,

                source: "whatsapp",

                user: userId

            });

            saved++;

        }

        catch (error) {

            console.log("Contact Sync Error:", error.message);

        }

    }

    //----------------------------------------------------------
    // Return Summary
    //----------------------------------------------------------

    return {

        totalContacts: contacts.length,

        saved,

        skipped

    };

};

//------------------------------------------------------------EXPORTS-------------------------------------------------------------

module.exports = {

    syncContacts

};