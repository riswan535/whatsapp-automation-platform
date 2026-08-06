//------------------------------------------------ IMPORTS ------------------------------------------------

const express = require("express");

const protect = require("../middleware/auth");

const { createGroup, getGroups, updateGroup, deleteGroup, getGroupMembers, addContactToGroup,   removeContactFromGroup } = require("../controllers/groupController");

const router = express.Router();

//------------------------------------------------ ROUTES ------------------------------------------------

// Create Group
router.post( "/create", protect, createGroup);

// View All Groups
router.get("/get", protect, getGroups);

// View Members of a Group
router.get("/:id/members", protect, getGroupMembers);

// Update Group
router.put("/update/:id", protect, updateGroup);

// Delete Group
router.delete("/delete/:id", protect, deleteGroup);

// Add Contact To Group
router.put("/:groupId/addcontact/:contactId", protect, addContactToGroup);

// Remove Contact From Group
router.put("/removecontact/:contactId", protect, removeContactFromGroup);

//------------------------------------------------ EXPORT ------------------------------------------------

module.exports = router;