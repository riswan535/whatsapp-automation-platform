import api from "./axios";

const token = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
});

// Get all groups
export const getGroups = async () => {
    const response = await api.get("/group/get", token());
    return response.data;
};

// Create group
export const createGroup = async (groupData) => {
    const response = await api.post(
        "/group/create",
        groupData,
        token()
    );
    return response.data;
};

// Update group
export const updateGroup = async (id, groupData) => {
    const response = await api.put(
        `/group/update/${id}`,
        groupData,
        token()
    );
    return response.data;
};

// Delete group
export const deleteGroup = async (id) => {
    const response = await api.delete(
        `/group/delete/${id}`,
        token()
    );
    return response.data;
};

// Get members
export const getGroupMembers = async (id) => {
    const response = await api.get(
        `/group/${id}/members`,
        token()
    );
    return response.data;
};

// Add contact
export const addContactToGroup = async (groupId, contactId) => {
    const response = await api.put(
        `/group/${groupId}/addcontact/${contactId}`,
        {},
        token()
    );
    return response.data;
};

// Remove contact
export const removeContactFromGroup = async (contactId) => {
    const response = await api.put(
        `/group/removecontact/${contactId}`,
        {},
        token()
    );
    return response.data;
};