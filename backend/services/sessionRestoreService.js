const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const { getBucket } = require("../config/gridfs");

const restoreSession = async () => {

    try {

        const authFolder = path.join(__dirname, "..", ".wwebjs_auth");

        //--------------------------------------------------
        // Already exists
        //--------------------------------------------------

        if (fs.existsSync(authFolder)) {

            console.log("Session already exists.");

            return;

        }

        console.log("No Local Session Found.");

        const bucket = getBucket();

        if (!bucket) {

           console.log("GridFS not initialized");

           return;

        }

        //--------------------------------------------------
        // Find latest backup
        //--------------------------------------------------

        const files = await bucket.find({

            filename: "main-session.zip"

        }).sort({

            uploadDate: -1

        }).toArray();

        if (files.length === 0) {

            console.log("No Backup Found In MongoDB");

            return;

        }

        console.log("Backup Found");

        const zipPath = path.join(__dirname, "..", "restore.zip");

        //--------------------------------------------------
        // Download backup
        //--------------------------------------------------

        await new Promise((resolve, reject) => {

            bucket.openDownloadStream(files[0]._id)

                .pipe(fs.createWriteStream(zipPath))

                .on("finish", resolve)

                .on("error", reject);

        });

        console.log("Backup Downloaded");

        //--------------------------------------------------
        // Extract
        //--------------------------------------------------

        await fs.createReadStream(zipPath)

            .pipe(unzipper.Extract({

                path: authFolder

            }))

            .promise();

        console.log("Session Restored");

        fs.unlinkSync(zipPath);

    }

    catch (error) {

        console.log("RESTORE ERROR");

        console.log(error);

    }

};

module.exports = {restoreSession};