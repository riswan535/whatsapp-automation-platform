//-----------------------------------------------------------------IMPORT------------------------------------------------------------------------------------------------------------------------

import axios from "../api/axios";

//-----------------------------------------------------------------IMPORT------------------------------------------------------------------------------------------------------------------------


export const getMessages = async (contactId) => {

    const token = localStorage.getItem("token");

    const response = await axios.get(

        `/message/getchat/${contactId}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};

export const sendMessage = async (contactId, message) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(

        "/message/sent",

        {
            contactId,
            message
        },

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;

};