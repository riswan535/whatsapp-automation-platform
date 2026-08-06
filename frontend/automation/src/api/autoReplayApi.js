// ------------------------------------------------ IMPORT ------------------------------------------------

import api from "./axios";

// ------------------------------------------------ TOKEN ------------------------------------------------

const token = () => ({

    headers: {

        Authorization: `Bearer ${sessionStorage.getItem("token")}`

    }

});

// ------------------------------------------------ CREATE RULE ------------------------------------------------

export const createAutoReply = async (data) => {

    const response = await api.post(

        "/autoreply/create",

        data,

        token()

    );

    return response.data;

};

// ------------------------------------------------ GET RULES ------------------------------------------------

export const getAutoReplies = async () => {

    const response = await api.get(

        "/autoreply/get",

        token()

    );

    return response.data;

};

// ------------------------------------------------ UPDATE RULE ------------------------------------------------

export const updateAutoReply = async (id, data) => {

    const response = await api.put(

        `/autoreply/update/${id}`,

        data,

        token()

    );

    return response.data;

};

// ------------------------------------------------ DELETE RULE ------------------------------------------------

export const deleteAutoReply = async (id) => {

    const response = await api.delete(

        `/autoreply/delete/${id}`,

        token()

    );

    return response.data;

};