//------------------------------------------------ IMPORT ------------------------------------------------

import api from "./axios";

//------------------------------------------------ TOKEN ------------------------------------------------

const token = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
});

//------------------------------------------------ CREATE CAMPAIGN ------------------------------------------------

export const createCampaign = async (campaignData) => {

    const response = await api.post(

        "/campaign/create",

        campaignData,

        token()

    );

    return response.data;

};

//------------------------------------------------ GET CAMPAIGNS ------------------------------------------------

export const getCampaigns = async () => {

    const response = await api.get(

        "/campaign/get",

        token()

    );

    return response.data;

};

//------------------------------------------------ UPDATE CAMPAIGN ------------------------------------------------

export const updateCampaign = async (id, campaignData) => {

    const response = await api.put(

        `/campaign/update/${id}`,

        campaignData,

        token()

    );

    return response.data;

};

//------------------------------------------------ DELETE CAMPAIGN ------------------------------------------------

export const deleteCampaign = async (id) => {

    const response = await api.delete(

        `/campaign/delete/${id}`,

        token()

    );

    return response.data;

};