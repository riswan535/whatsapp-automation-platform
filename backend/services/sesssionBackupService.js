//--------------------------------------------------IMPORTS--------------------------------------------------

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const { getBucket } = require("../config/gridfs");
const { getClient } = require("./whatsappService");
const state = require("./whatsappState");
const { destroyClient, restartClient } = require("./whatsappService");

//--------------------------------------------------BACKUP FUNCTION-------------------------------------------

const backupSession = async (restart = true) => {

    if (state.isLoggingOut) {

        console.log("Backup skipped because logout is in progress.");

        return;

    }

    state.isBackingUp = true;

    try {

        console.log("========== SESSION BACKUP STARTED ==========");

        const client = getClient();

        if (!client) {

            throw new Error("WhatsApp Client Not Found");

        }

        //--------------------------------------------------
        // Stop WhatsApp
        //--------------------------------------------------

                console.log("Stopping WhatsApp...");

                  await destroyClient();

                  console.log("WhatsApp Stopped");
        //--------------------------------------------------
        // Wait until Chromium releases session files
        //--------------------------------------------------

        await new Promise(resolve => setTimeout(resolve, 5000));

        //--------------------------------------------------
        // Zip Path
        //--------------------------------------------------

        const zipPath = path.join(__dirname, "..", "session-backup.zip");

        //--------------------------------------------------
        // Delete Previous Local Zip
        //--------------------------------------------------

        if (fs.existsSync(zipPath)) {

            fs.unlinkSync(zipPath);

        }

        //--------------------------------------------------
        // Create ZIP
        //--------------------------------------------------

        const output = fs.createWriteStream(zipPath);

        const archive = archiver("zip", {

            zlib: {

                level: 9

            }

        });

        archive.pipe(output);

        archive.directory(".wwebjs_auth", false);

        archive.finalize();

        //--------------------------------------------------
        // Wait Until Zip Completed
        //--------------------------------------------------

        await new Promise((resolve, reject) => {

            output.on("close", resolve);

            archive.on("error", reject);

        });

        console.log("Session Folder Zipped");

        //--------------------------------------------------
        // GridFS
        //--------------------------------------------------

        const bucket = getBucket();

        if (!bucket) {

            throw new Error("GridFS Not Initialized");

        }

        //--------------------------------------------------
        // Delete Old Backup
        //--------------------------------------------------

        console.log("Checking Old Backups...");

        const oldFiles = await bucket.find({

            filename: "main-session.zip"

        }).toArray();

        if (oldFiles.length > 0) {

            console.log(`Found ${oldFiles.length} Old Backup(s)`);

            for (const file of oldFiles) {

                await bucket.delete(file._id);

            }

            console.log("Old Backup Deleted");

        }

        else {

            console.log("No Previous Backup Found");

        }

        //--------------------------------------------------
        // Upload New Backup
        //--------------------------------------------------

        console.log("Uploading Session To MongoDB...");

        const uploadStream = bucket.openUploadStream("main-session.zip");

        const readStream = fs.createReadStream(zipPath);

        await new Promise((resolve, reject) => {

            readStream
                .pipe(uploadStream)
                .on("error", reject)
                .on("finish", resolve);

        });

        console.log("Backup Uploaded Successfully");

        //--------------------------------------------------
        // Delete Temporary Zip
        //--------------------------------------------------

        if (fs.existsSync(zipPath)) {

            fs.unlinkSync(zipPath);

        }

        console.log("Temporary Zip Deleted");

        //--------------------------------------------------
        // Restart WhatsApp (Optional)
        //--------------------------------------------------

        if (restart) {

            console.log("Restarting WhatsApp...");

            await restartClient();

            console.log("WhatsApp Restarted");

        }

        console.log("========== SESSION BACKUP COMPLETED ==========");

    }

    catch (error) {

        console.log("SESSION BACKUP ERROR");

        console.log(error.message);

    }

    finally {

        state.isBackingUp = false;

    }

};

//--------------------------------------------------EXPORTS--------------------------------------------------

module.exports = {

    backupSession

};