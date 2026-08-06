import api from "./axios";

const token = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
});

// --------------------------------------------
// Create Schedule
// --------------------------------------------

export const createSchedule = async (scheduleData) => {

    const response = await api.post(
        "/schedule",
        scheduleData,
        token()
    );

    return response.data;

};

// --------------------------------------------
// Get All Schedules
// --------------------------------------------

export const getSchedules = async () => {

    const response = await api.get(
        "/schedule/get",
        token()
    );

    return response.data;

};

// --------------------------------------------
// Update Schedule
// --------------------------------------------

export const updateSchedule = async (id, scheduleData) => {

    const response = await api.put(
        `/schedule/update/${id}`,
        scheduleData,
        token()
    );

    return response.data;

};

// --------------------------------------------
// Delete Schedule
// --------------------------------------------

export const deleteSchedule = async (id) => {

    const response = await api.delete(
        `/schedule/delete/${id}`,
        token()
    );

    return response.data;

};