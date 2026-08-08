//-------------------------------------------------------------IMPORTS-------------------------------------------------------------

const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const puppeteer = require("puppeteer");

const Contact = require("../models/contacts");
const Message = require("../models/message");
const AutoReply = require("../models/autoReplay");

const state = require("./whatsappState");

const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;

console.log("Chrome executable:", chromePath);

//-------------------------------------------------------------CLIENT--------------------------------------------------------------

let client = null;
let latestQR = null;
let backupInterval = null;
let initialBackupDone = false;

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
    executablePath: chromePath,
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

  client.on("ready", async () => {

    latestQR = null;

    console.log("WhatsApp Connected Successfully");
    console.log(client.info);

    // Run only once
    if (initialBackupDone) {
        return;
    }

    initialBackupDone = true;

    setTimeout(async () => {

        try {

            console.log("");
            console.log("====================================");
            console.log("Creating Initial Backup...");
            console.log("====================================");

            const { backupSession } = require("./sesssionBackupService");

            await backupSession(true);

            console.log("Initial Session Backup Completed");

        }

        catch (error) {

            console.log(error.message);

        }

    }, 10000);

});

  client.on("auth_failure", (msg) => {
    console.log("Authentication Failed:", msg);
  });

  client.on("disconnected", async (reason) => {
    console.log("WhatsApp Disconnected:", reason);

    if (state.isBackingUp) {
      console.log("Backup in progress.");
      return;
    }

    try {
      await destroyClient();

      const { logoutHandler } = require("./logoutHandlerService");

      await logoutHandler();

      console.log("Logout Cleanup Completed");
    } catch (error) {
      console.log(error.message);
    } finally {
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
        const found = rule.keyword.some((keyword) =>
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
    } catch (error) {
      console.log(error.message);
    }
  });

  //------------------------------------------------------RETURN-------------------------------------------------------------

  return client;
};

//---------------------------------------------------------HELPERS-------------------------------------------------------------

const getClient = () => {
  return client;
};

const getQR = () => {
  return latestQR;
};

const destroyClient = async () => {
  if (!client) return;

  try {
    await client.destroy();

    console.log("WhatsApp Client Destroyed");
  } catch (error) {
    if (
      error.message.includes("detached Frame") ||
      error.message.includes("Navigating frame was detached")
    ) {
      console.log("Browser already closed.");
    } else {
      console.log(error.message);
    }
  }

  client = null;
  latestQR = null;
};

//------------------------------------------------------------------LOGOUT--------------------------------------------------------------------------------------------------

const logoutWhatsApp = async () => {
  if (!client) return;

  try {
    console.log("Logging out from WhatsApp...");

    state.isLoggingOut = true;

    await client.logout();
  } catch (error) {
    console.log(error.message);
    state.isLoggingOut = false;
  }
};

const setBackupInterval = (interval) => {
  backupInterval = interval;
};

const clearBackupInterval = () => {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
  }
};

const restartClient = async () => {

    console.log("======================================");
    console.log("Restarting WhatsApp...");
    console.log("======================================");

    await destroyClient();

    const newClient = createClient();

    await new Promise((resolve, reject) => {

        newClient.once("ready", () => {

            console.log("======================================");
            console.log("WhatsApp Fully Ready");
            console.log("======================================");

            resolve();

        });

        newClient.once("auth_failure", reject);

        newClient.initialize();

    });

    return newClient;
};

//------------------------------------------------------------EXPORTS--------------------------------------------------------------

module.exports = {
  createClient,
  getClient,
  getQR,
  destroyClient,
  restartClient,
  logoutWhatsApp,
  setBackupInterval,
  clearBackupInterval
};