//-------------------------------------------------------------IMPORTS-------------------------------------------------------------

const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const {
  getClient,
  createClient,
  getQR,
  destroyClient,
} = require("../services/whatsappService");

const { getBucket } = require("../config/gridfs");
const { backupSession } = require("../services/sesssionBackupService");

//--------------------------------------------------------GET CONNECTION STATUS-----------------------------------------------------

router.get("/status", (req, res) => {
  const client = getClient();

  if (!client || !client.info) {
    return res.json({
      connected: false,
    });
  }

  res.json({
    connected: true,
    number: client.info.wid.user,
    pushName: client.info.pushname,
  });
});

//-------------------------------------------------------------CONNECT WHATSAPP-----------------------------------------------------

router.post("/connect", async (req, res) => {
    try {

        let client = getClient();

        if (client) {
            return res.json({
                message: "WhatsApp client is already running"
            });
        }

        client = createClient();

        await client.initialize();

        res.json({
            message: "WhatsApp Initialization Started"
        });

    } catch (error) {

        console.log("WhatsApp Connect Error:", error.message);

        res.status(500).json({
            message: error.message
        });

    }
});

//-------------------------------------------------------------GET QR---------------------------------------------------------------

router.get("/qr", (req, res) => {
  const qr = getQR();

  if (!qr) {
    return res.json({
      qr: null,
    });
  }

  res.json({
    qr,
  });
});

//-------------------------------------------------------------LOGOUT---------------------------------------------------------------

router.post("/disconnect", async (req, res) => {

    try {

        const client = getClient();

        //--------------------------------------------------
        // Logout WhatsApp
        //--------------------------------------------------

        if (client) {

            try {

                console.log("Logging out WhatsApp...");

                await client.logout();

            }

            catch (err) {

                console.log("logout() failed:");
                console.log(err.message);

            }

            //--------------------------------------------------
            // Wait before destroying browser
            //--------------------------------------------------

            await new Promise(resolve => setTimeout(resolve, 5000));

            try {

                await destroyClient();

            }

            catch (err) {

                console.log(err.message);

            }

        }

        //--------------------------------------------------
        // Delete LocalAuth
        //--------------------------------------------------

        const authFolder = path.join(__dirname, "..", ".wwebjs_auth");

        if (fs.existsSync(authFolder)) {

            fs.rmSync(authFolder, {

                recursive: true,
                force: true

            });

            console.log("LocalAuth Deleted");

        }

        //--------------------------------------------------
        // Delete Mongo Backup
        //--------------------------------------------------

        const bucket = getBucket();

        if (bucket) {

            const files = await bucket.find({

                filename: "main-session.zip"

            }).toArray();

            for (const file of files) {

                await bucket.delete(file._id);

            }

            console.log("Mongo Backup Deleted");

        }

        res.json({

            message: "WhatsApp Logged Out"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

//-------------------------------------------------------------BACKUP-------------------------------------------------------------

router.post("/backup", async (req, res) => {
  try {
    await backupSession();

    res.json({
      message: "Backup Completed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//-------------------------------------------------------------EXPORTS--------------------------------------------------------------

module.exports = router;