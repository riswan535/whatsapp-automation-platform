//--------------------------------------------------IMPORTS--------------------------------------------------

const fs = require("fs");
const path = require("path");

const { getBucket } = require("../config/gridfs");

//--------------------------------------------------LOGOUT HANDLER--------------------------------------------------

const logoutHandler = async () => {
  try {
    console.log("");
    console.log("======================================");
    console.log("WHATSAPP LOGOUT DETECTED");
    console.log("Cleaning Session...");
    console.log("======================================");

    //--------------------------------------------------
    // Delete Local Session
    //--------------------------------------------------

    const authFolder = path.join(__dirname, "..", ".wwebjs_auth");

    if (fs.existsSync(authFolder)) {
      console.log("Deleting Local Session...");

      fs.rmSync(authFolder, {
        recursive: true,
        force: true,
      });

      console.log("Local Session Deleted");
    } else {
      console.log("No Local Session Found");
    }

    //--------------------------------------------------
    // Delete MongoDB Backup
    //--------------------------------------------------

    const bucket = getBucket();

    if (bucket) {
      console.log("Deleting MongoDB Backup...");

      const backups = await bucket
        .find({
          filename: "main-session.zip",
        })
        .toArray();

      if (backups.length > 0) {
        for (const backup of backups) {
          await bucket.delete(backup._id);
        }

        console.log("MongoDB Backup Deleted");
      } else {
        console.log("No MongoDB Backup Found");
      }
    } else {
      console.log("GridFS Not Initialized");
    }

    //--------------------------------------------------
    // Finished
    //--------------------------------------------------

    console.log("");
    console.log("======================================");
    console.log("SESSION CLEANUP COMPLETED");
    console.log("Waiting For User To Generate New QR...");
    console.log("======================================");
  } catch (error) {
    console.log("");
    console.log("======================================");
    console.log("LOGOUT HANDLER ERROR");
    console.log(error.message);
    console.log("======================================");
  }
};

//--------------------------------------------------EXPORTS--------------------------------------------------

module.exports = {
  logoutHandler,
};