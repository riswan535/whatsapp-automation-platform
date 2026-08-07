//---

const Group = require("../models/group");
const Contact = require("../models/contacts")

//------------

const createGroup = async (req, res) => {

    try {

        const { name, description } = req.body;

        const exGroup = await Group.findOne({

            user: req.user.id,

            name: name

        });

        if (exGroup) {

            return res.status(400).json({
                message: "Group already exists"
            });

        }

        const group = await Group.create({

            user: req.user.id,

            name,

            description

        });

        res.status(201).json(group);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//----------------------

const updateGroup = async (req, res) => {

    try {

        const { name, description } = req.body;

        const group = await Group.findOneAndUpdate(

    {

        _id: req.params.id,
        user: req.user.id

    },

    {

        name,
        description

    },

    {

        new: true

    }

);

        res.status(200).json(group);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//-----

const deleteGroup = async (req, res) => {

    try {

        const { id } = req.params;

        const group = await Group.findOne({

         _id: id,
         user: req.user.id

        });

        if (!group) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        // Remove group reference from contacts

        await Contact.updateMany(

            {
                group: id
            },

            {
                $set: {
                    group: null
                }
            }

        );

        // Delete group

        await Group.findByIdAndDelete(id);

        res.status(200).json({

            message: "Group deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}; 

//----------


const getGroups = async (req, res) => {

    try {

        const groups = await Group.find({

         user: req.user.id

        }).populate("user", "name");

        res.status(200).json(groups);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//--------

const getGroupMembers = async (req, res) => {

    try {

        const { id } = req.params;

        const group = await Group.findOne({

            _id: id,
            user: req.user.id

        });

        if (!group) {

            return res.status(404).json({

                message: "Group not found"

            });

        }

        const contacts = await Contact.find({

            group: id,
            user: req.user.id

        }).select("name phone source");

        res.status(200).json({

            group,
            contacts

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

//-----------addd contact

const addContactToGroup = async (req, res) => {

    try {

        const { groupId, contactId } = req.params;

       const contact = await Contact.findOneAndUpdate(

    {

        _id: contactId,
        user: req.user.id

    },

    {

        group: groupId

    },

    {

        new: true

    }

);

        if (!contact) {

            return res.status(404).json({
                message: "Contact not found"
            });

        }

        res.status(200).json({

            message: "Contact added to group",

            contact

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//---------remove contact

const removeContactFromGroup = async (req, res) => {

    try {

        const { contactId } = req.params;

        const contact = await Contact.findOneAndUpdate(

    {

        _id: contactId,
        user: req.user.id

    },

    {

        group: null

    },

    {

        new: true

    }

);

        if (!contact) {

            return res.status(404).json({
                message: "Contact not found"
            });

        }

        res.status(200).json({

            message: "Contact removed from group",

            contact

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

//--------

module.exports = { createGroup, getGroups, updateGroup, deleteGroup, getGroupMembers, addContactToGroup, removeContactFromGroup };