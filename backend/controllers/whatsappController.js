//---------------------------------------------------------IMPORTS---------------------------------------------------------

const { getClient, getQR } = require("../services/whatsappService");

//------------------------------------------------------CONNECT WHATSAPP---------------------------------------------------

const connectWhatsApp = async (req, res) => {

    try {

        const client = getClient();

        //--------------------------------------------------
        // No client
        //--------------------------------------------------

        if (!client) {

            return res.status(500).json({

                connected: false,
                message: "WhatsApp client is not initialized"

            });

        }

        //--------------------------------------------------
        // Already Connected
        //--------------------------------------------------

        if (client.info) {

            return res.status(200).json({

                connected: true,
                message: "WhatsApp already connected",
                user: client.info.pushname,
                number: client.info.wid.user

            });

        }

        //--------------------------------------------------
        // Waiting
        //--------------------------------------------------

        return res.status(200).json({

            connected: false,
            message: "Waiting for WhatsApp connection"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};

//-----------------------------------------------------------GET QR--------------------------------------------------------

const getQRcode = async (req, res) => {

    try {

        const client = getClient();

        //--------------------------------------------------
        // Already Connected
        //--------------------------------------------------

        if (client && client.info) {

            return res.status(400).json({

                message: "WhatsApp already connected"

            });

        }

        const qr = getQR();

        if (!qr) {

            return res.status(404).json({

                message: "QR not available"

            });

        }

        res.status(200).json({

            qr

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};

//----------------------------------------------------------GET STATUS-----------------------------------------------------

const getStatus = async (req, res) => {

    try {

        const client = getClient();

        //--------------------------------------------------
        // Client not created
        //--------------------------------------------------

        if (!client) {

            return res.status(200).json({

                connected: false,
                status: "disconnected"

            });

        }

        //--------------------------------------------------
        // Connected
        //--------------------------------------------------

        if (client.info) {

            return res.status(200).json({

                connected: true,
                status: "connected",
                user: client.info.pushname,
                number: client.info.wid.user

            });

        }

        //--------------------------------------------------
        // Connecting
        //--------------------------------------------------

        return res.status(200).json({

            connected: false,
            status: "connecting"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};

//-----------------------------------------------------------EXPORTS-------------------------------------------------------

module.exports = {

    connectWhatsApp,
    getQRcode,
    getStatus

};