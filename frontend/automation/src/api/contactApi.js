import api from "../api/axios";

const token = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
});

export const getContacts = async () => {
    const response = await api.get("/contact/getContacts", token());
    return response.data;
};

export const addContact = async (contact) => {
    const response = await api.post("/contact/addcontact", contact, token());
    return response.data;
};

export const deleteContact = async (id) => {
    const response = await api.delete(`/contact/deleteContact/${id}`, token());
    return response.data;
};

export const syncContacts = async () => {
    const response = await api.post("/contact/sync", {}, token());
    return response.data;
};

export const deleteSelectedContacts = async (ids) => {

    const response = await api.delete(
        "/contact/deleteSelected",
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            },
            data: { ids }
        }
    );

    return response.data;

};