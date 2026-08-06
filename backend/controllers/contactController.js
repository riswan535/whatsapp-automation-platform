//-------------------------------------------------------------IMPORTS------------------------------------------------------------------------------------------

const Contacts = require("../models/Contacts");
const { syncContacts } = require("../services/contactSyncService");

//-----------------------------------------------------------ADD CONTACT----------------------------------------------------------------------------------------

const addContact = async (req, res) => {

    try {

        const { name, phone } = req.body;

        const exists = await Contacts.findOne({
            phone,
            user: req.user.id
        });

        if (exists) {
            return res.status(400).json({
                message: "Contact already exists"
            });
        }

        const contact = await Contacts.create({
            name,
            phone,
            user: req.user.id
        });

        res.status(201).json(contact);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//---------------------------------------------------------GET USER CONTACTS-----------------------------------------------------------------------------------

const getContact = async (req, res) => {

    try {

        const contacts = await Contacts.find({

            user: req.user.id

        }).populate("group", "name");

        res.status(200).json(contacts);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

//--------------------------------------------------------DELETE USER CONTACTS---------------------------------------------------------------------------------

const deleteContact = async (req, res) => {

    try {

        const { id } = req.params;

        const contact = await Contacts.findByIdAndDelete(id);

        if (!contact) {

            return res.status(404).json({

                message: "Contact not found"

            });

        }

        res.status(200).json({

            message: "Contact deleted"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

//----------------------------------------------------------SYNC WHATSAPP CONTACTS-----------------------------------------------------------------------------

const syncWhatsappContacts = async (req, res) => {

    console.log(req.user);

    try {

        const result = await syncContacts(req.user.id);

        res.status(200).json({

            message: "Contacts synced successfully",

            ...result

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

const deleteSelectedContacts = async (req, res) => {

    try {

        const { ids } = req.body;

        if (!ids || ids.length === 0) {

            return res.status(400).json({
                message: "No contacts selected"
            });

        }

        await Contacts.deleteMany({

            _id: { $in: ids },

            user: req.user.id

        });

        res.status(200).json({

            message: "Selected contacts deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

//-------------------------------------------------------------EXPORTS------------------------------------------------------------------------------------------

module.exports = {

    addContact,

    getContact,

    deleteContact,

    syncWhatsappContacts,

    deleteSelectedContacts

};