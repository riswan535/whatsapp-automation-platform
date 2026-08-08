//------------------------------------------------------IMPORTS------------------------------------------------------

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { initializeGridFS } = require("./config/gridfs");

const authRoutes = require("./route/authRoutes");
const adminRoutes = require("./route/adminRoutes");
const contactRoutes = require("./route/contactRoutes");
const whatsappRoutes = require("./route/whatsappRoutes");
const messageRoutes = require("./route/messageRoutes");
const scheduleRoutes = require("./route/scheduleRoutes");
const autoReplayRoutes = require("./route/autoReplayRoutes");
const campaignRoutes = require("./route/campaignRoutes");
const dashBoardRoutes = require("./route/dashBoardRoutes");
const groupRoutes = require("./route/groupRoutes");

const sentScheduledMSG = require("./services/scheduleService");
const runCampaigns = require("./services/campaignService");

const {
    createClient,
    destroyClient
} = require("./services/whatsappService");

const { backupSession } = require("./services/sesssionBackupService");
const { restoreSession } = require("./services/sessionRestoreService");

//------------------------------------------------------APP----------------------------------------------------------

const app = express();

app.use(cors());
app.use(express.json());

//------------------------------------------------------ROUTES-------------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/autoreply", autoReplayRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/group", groupRoutes);

//------------------------------------------------------TEST---------------------------------------------------------

app.get("/get", (req, res) => {
    res.send("Server is Live");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "WhatsApp Automation Backend is running"
    });
});

//------------------------------------------------------PORT---------------------------------------------------------

const PORT = process.env.PORT || 5000;

//------------------------------------------------------BACKUP TIMER-------------------------------------------------

let backupTimer = null;

const startBackupTimer = () => {

    if (backupTimer) {

        console.log("Backup Timer Already Running");

        return;

    }

    console.log("======================================");
    console.log("Hourly Backup Timer Started");
    console.log("======================================");

    backupTimer = setInterval(async () => {

        try {

            console.log("");
            console.log("======================================");
            console.log("Running Hourly Backup...");
            console.log("======================================");

            await backupSession(true);

            console.log("Hourly Backup Completed");

        }

        catch (error) {

            console.log("Hourly Backup Error");
            console.log(error.message);

        }

    }, 1000 * 60 * 60 * 24); // Every 24 Hour

    // TESTING
    // }, 90 * 1000); // Every 2 minits

};

//------------------------------------------------------START SERVER-------------------------------------------------

const startServer = async () => {

    try {

        //--------------------------------------------------
        // MongoDB
        //--------------------------------------------------

        await connectDB();

        initializeGridFS();

        //--------------------------------------------------
        // Restore Previous Session
        //--------------------------------------------------

        await restoreSession();

        //--------------------------------------------------
        // Background Services
        //--------------------------------------------------

        sentScheduledMSG();

        runCampaigns();

        //--------------------------------------------------
        // Express
        //--------------------------------------------------

        app.listen(PORT, "0.0.0.0", async () => {

            console.log(`Server running on port ${PORT}`);

            try {

                const client = createClient();

                await client.initialize();

                console.log("======================================");
                console.log("WhatsApp initialization started");
                console.log("======================================");

                //--------------------------------------------------
                // Start Hourly Backup Timer
                //--------------------------------------------------

                startBackupTimer();

            }

            catch (error) {

                console.log("");
                console.log("======================================");
                console.log("WhatsApp Restore Failed");
                console.log(error.message);
                console.log("======================================");

                await destroyClient();

            }

        });

    }

    catch (error) {

        console.log("Server Startup Error:", error.message);

    }

};

startServer();