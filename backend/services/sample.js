// //-------------------------------------------------------------IMPORTS-------------------------------------------------------------

// const { Client, LocalAuth } = require("whatsapp-web.js");
// const QRCode = require("qrcode");

// const Contact = require("../models/contacts");
// const Message = require("../models/message");
// const AutoReply = require("../models/autoReplay");

// const state = require("./whatsappState");
// const { backupSession } = require("./sesssionBackupService");

// //-------------------------------------------------------------CLIENT--------------------------------------------------------------

// let client = null;
// let latestQR = null;
// let backupInterval = null;

// // Prevent backup loop
// let initialBackupDone = false;

// //---------------------------------------------------------CREATE CLIENT-----------------------------------------------------------

// const createClient = () => {

//     if (client) {

//         return client;

//     }

//     client = new Client({

//         authStrategy: new LocalAuth({

//             clientId: "main-session"

//         }),

//         puppeteer: {

//             headless: true,

//             args: [

//                 "--no-sandbox",
//                 "--disable-setuid-sandbox"

//             ]

//         }

//     });

//     //------------------------------------------------------QR-------------------------------------------------------------

//     client.on("qr", async (qr) => {

//         latestQR = await QRCode.toDataURL(qr);

//         console.log("QR Generated");

//     });

//     //------------------------------------------------------LOADING-------------------------------------------------------------

//     client.on("loading_screen", (percent, message) => {

//         console.log(percent, message);

//     });

//     //------------------------------------------------------AUTHENTICATED-------------------------------------------------------------

//     client.on("authenticated", () => {

//         latestQR = null;

//         console.log("WhatsApp Authenticated");

//     });

//     //------------------------------------------------------READY-------------------------------------------------------------

//     client.on("ready", async () => {

//         latestQR = null;

//         console.log("WhatsApp Connected Successfully");

//         console.log(client.info);

//         //------------------------------------------------------
//         // Backup only once after first successful login
//         //------------------------------------------------------

//         if (!initialBackupDone) {

//             initialBackupDone = true;

//             try {

//                 console.log("Waiting before backup...");

//                 await new Promise(resolve => setTimeout(resolve, 10000));

//                 console.log("Creating Initial Backup...");

//                 await backupSession();

//                 console.log("Initial Session Backup Completed");

//             }

//             catch (error) {

//                 console.log("Initial Backup Failed");

//                 console.log(error.message);

//             }

//         }

//     });

//     //------------------------------------------------------AUTH FAILURE-------------------------------------------------------------

//     client.on("auth_failure", (msg) => {

//         console.log("Authentication Failed:", msg);

//     });

//     //------------------------------------------------------DISCONNECTED-------------------------------------------------------------

//     client.on("disconnected", async (reason) => {

//         console.log("WhatsApp Disconnected:", reason);

//         if (reason !== "LOGOUT") return;

//         if (state.isBackingUp) {

//             console.log("Logout happened while backup was running.");

//             return;

//         }

//         if (state.isLoggingOut) return;

//         state.isLoggingOut = true;

//         try {

//             console.log("Destroying WhatsApp Client...");

//             await destroyClient();

//             const { logoutHandler } = require("./logoutHandlerService");

//             await logoutHandler();

//             initialBackupDone = false;

//             console.log("Logout cleanup completed.");

//             console.log("Waiting for user to generate new QR...");

//         }

//         catch (error) {

//             console.log("Logout Recovery Error:");

//             console.log(error.message);

//         }

//         finally {

//             state.isLoggingOut = false;

//         }

//     });

//     //------------------------------------------------------MESSAGE EVENT-------------------------------------------------------------

//     client.on("message", async (msg) => {

//         try {

//             const waContact = await msg.getContact();

//             const phone = waContact.id.user;

//             console.log("Phone:", phone);

//             const contact = await Contact.findOne({

//                 phone: phone

//             });

//             if (!contact) {

//                 console.log("Contact not found");

//                 return;

//             }

//             //------------------------------------------------------
//             // Save Incoming Message
//             //------------------------------------------------------

//             await Message.create({

//                 contact: contact._id,

//                 user: contact.user,

//                 message: msg.body,

//                 direction: "incoming",

//                 status: "received"

//             });

//             console.log("Incoming message saved");

//             //------------------------------------------------------
//             // Auto Reply
//             //------------------------------------------------------

//             const rules = await AutoReply.find({

//                 user: contact.user,

//                 group: contact.group,

//                 status: true

//             });

//             const incomingText = msg.body.toLowerCase();

//             for (const rule of rules) {

//                 const found = rule.keyword.some(keyword =>

//                     incomingText.includes(keyword.toLowerCase())

//                 );

//                 if (found) {

//                     await client.sendMessage(

//                         msg.from,

//                         rule.replyMessage

//                     );

//                     await Message.create({

//                         contact: contact._id,

//                         user: contact.user,

//                         message: rule.replyMessage,

//                         direction: "outgoing",

//                         status: "sent"

//                     });

//                     console.log("Auto Reply Sent");

//                     break;

//                 }

//             }

//         }

//         catch (error) {

//             console.log(error.message);

//         }

//     });

//     return client;

// };

// //---------------------------------------------------------HELPERS-------------------------------------------------------------

// const getClient = () => {

//     return client;

// };

// const getQR = () => {

//     return latestQR;

// };

// const destroyClient = async () => {

//     if (!client) return;

//     try {

//         await client.destroy();

//         console.log("WhatsApp Client Destroyed");

//     }

//     catch (error) {

//         console.log(error.message);

//     }

//     client = null;

//     latestQR = null;

// };

// const setBackupInterval = (interval) => {

//     backupInterval = interval;

// };

// const clearBackupInterval = () => {

//     if (backupInterval) {

//         clearInterval(backupInterval);

//         backupInterval = null;

//     }

// };

// //------------------------------------------------------------EXPORTS--------------------------------------------------------------

// module.exports = {

//     createClient,
//     getClient,
//     getQR,
//     destroyClient,
//     setBackupInterval,
//     clearBackupInterval

// };

//-------------------------------------------------working session old---------------------------------------------------------------------------------------
//-------------------------------------------------------------IMPORTS-------------------------------------------------------------

const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");

const Contact = require("../models/contacts");
const Message = require("../models/message");
const AutoReply = require("../models/autoReplay");

const state = require("./whatsappState");

//-------------------------------------------------------------CLIENT--------------------------------------------------------------

let client = null;
let latestQR = null;
let backupInterval = null;

//---------------------------------------------------------CREATE CLIENT-----------------------------------------------------------

const createClient = () => {

    if (client) {

        return client;

    }

    client = new Client({

        authStrategy: new LocalAuth({

            clientId: "main-session"

        }),

        puppeteer: {

            headless: true,

            args: [

                "--no-sandbox",
                "--disable-setuid-sandbox"

            ]

        }

    });

    //------------------------------------------------------EVENTS-------------------------------------------------------------

    client.on("qr", async (qr) => {

        latestQR = await QRCode.toDataURL(qr);

        console.log("QR Generated");

    });

    client.on("loading_screen", (percent, message) => {

        console.log(percent, message);

    });

    client.on("authenticated", () => {

        latestQR = null;

        console.log("WhatsApp Authenticated");

    });

    client.on("ready", () => {

        latestQR = null;

        console.log("WhatsApp Connected Successfully");

        console.log(client.info);

    });

    client.on("auth_failure", (msg) => {

        console.log("Authentication Failed:", msg);

    });

    client.on("disconnected", async (reason) => {

        console.log("WhatsApp Disconnected:", reason);

        if (reason !== "LOGOUT") return;

        if (state.isBackingUp) {

            console.log("Logout happened while backup was running.");

            return;

        }

        if (state.isLoggingOut) return;

        state.isLoggingOut = true;

        try {

            console.log("Destroying WhatsApp Client...");

            await destroyClient();

            const { logoutHandler } = require("./logoutHandlerService");

            await logoutHandler();

            console.log("Logout cleanup completed.");

            console.log("Waiting for user to generate new QR...");

        }

        catch (error) {

            console.log("Logout Recovery Error:");

            console.log(error.message);

        }

        finally {

            state.isLoggingOut = false;

        }

    });

    //------------------------------------------------------MESSAGE EVENT-----------------------------------------------------

    client.on("message", async (msg) => {

        try {

            const waContact = await msg.getContact();

            const phone = waContact.id.user;

            console.log("Phone:", phone);

            const contact = await Contact.findOne({

                phone: phone

            });

            if (!contact) {

                console.log("Contact not found");

                return;

            }

            //-------------------------------- Save Incoming Message --------------------------------

            await Message.create({

                contact: contact._id,

                user: contact.user,

                message: msg.body,

                direction: "incoming",

                status: "received"

            });

            console.log("Incoming message saved");

            //-------------------------------- Auto Reply --------------------------------

            const rules = await AutoReply.find({

                user: contact.user,

                group: contact.group,

                status: true

            });

            const incomingText = msg.body.toLowerCase();

            for (const rule of rules) {

                const found = rule.keyword.some(keyword =>

                    incomingText.includes(keyword.toLowerCase())

                );

                if (found) {

                    await client.sendMessage(

                        msg.from,

                        rule.replyMessage

                    );

                    await Message.create({

                        contact: contact._id,

                        user: contact.user,

                        message: rule.replyMessage,

                        direction: "outgoing",

                        status: "sent"

                    });

                    console.log("Auto Reply Sent");

                    break;

                }

            }

        }

        catch (error) {

            console.log(error.message);

        }

    });

    //------------------------------------------------------RETURN-------------------------------------------------------------

    return client;

};

//---------------------------------------------------------HELPERS-------------------------------------------------------------

// const getClient = () => {

//     return client;

// };

// const getQR = () => {

//     return latestQR;

// };

// const destroyClient = async () => {

//     if (!client) return;

//     try {

//         await client.destroy();

//         console.log("WhatsApp Client Destroyed");

//     }

//     catch (error) {

//         console.log(error.message);

//     }

//     client = null;

//     latestQR = null;

// };

// const setBackupInterval = (interval) => {

//     backupInterval = interval;

// };

// const clearBackupInterval = () => {

//     if (backupInterval) {

//         clearInterval(backupInterval);

//         backupInterval = null;

//     }

// };

// //------------------------------------------------------------EXPORTS--------------------------------------------------------------

// module.exports = {

//     createClient,
//     getClient,
//     getQR,
//     destroyClient,
//     setBackupInterval,
//     clearBackupInterval

// };


//whatapp route diconnect---------------

// router.post("/disconnect", async (req, res) => {

//     try {

//         const client = getClient();

//         if (client) {

//             try {

//                 await client.logout();

//             }

//             catch (error) {

//                 console.log(error.message);

//             }

//             await destroyClient();

//         }

//         //--------------------------------------------------
//         // Delete Local Session
//         //--------------------------------------------------

//         const authFolder = path.join(__dirname, "..", ".wwebjs_auth");

//         if (fs.existsSync(authFolder)) {

//             fs.rmSync(authFolder, {

//                 recursive: true,

//                 force: true

//             });

//         }

//         //--------------------------------------------------
//         // Delete MongoDB Backup
//         //--------------------------------------------------

//         const bucket = getBucket();

//         if (bucket) {

//             const files = await bucket.find({

//                 filename: "main-session.zip"

//             }).toArray();

//             for (const file of files) {

//                 await bucket.delete(file._id);

//             }

//         }

//         res.json({

//             message: "WhatsApp Logged Out"

//         });

//     }

//     catch (error) {

//         res.status(500).json({

//             message: error.message

//         });

//     }

// });

