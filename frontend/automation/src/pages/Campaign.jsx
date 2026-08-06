//------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";

import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiSend,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiSearch
} from "react-icons/fi";

import {
    createCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaign
} from "../api/campaignApi";

import { getGroups } from "../api/groupApi";

import "../styles/Campaign.css";

//------------------------------------------------ FUNCTION ------------------------------------------------

function Campaign() {

   useWhatsAppCheck();

    const [campaigns, setCampaigns] = useState([]);

    const [groups, setGroups] = useState([]);

    const [editingCampaign, setEditingCampaign] = useState(null);

    const [name, setName] = useState("");

    const [group, setGroup] = useState("");

    const [message, setMessage] = useState("");

    const [scheduleTime, setScheduleTime] = useState("");

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    //------------------------------------------------

    useEffect(() => {

        loadData();

    }, []);

    //------------------------------------------------

    const loadData = async () => {

        try {

            const campaignData = await getCampaigns();

            const groupData = await getGroups();

            setCampaigns(campaignData);

            setGroups(groupData);

        }

        catch (error) {

            console.log(error);

        }

    };

    //------------------------------------------------

    const resetForm = () => {

        setEditingCampaign(null);

        setName("");

        setGroup("");

        setMessage("");

        setScheduleTime("");

    };

    //------------------------------------------------

    const handleSubmit = async () => {

        if (

            !name ||

            !group ||

            !message ||

            !scheduleTime

        ) {

            alert("Please fill all fields");

            return;

        }

        try {

            setLoading(true);

            if (editingCampaign) {

                await updateCampaign(

                    editingCampaign._id,

                    {

                        name,

                        group,

                        message,

                        scheduleTime,

                        status: editingCampaign.status

                    }

                );

            }

            else {

                await createCampaign({

                    name,

                    group,

                    message,

                    scheduleTime

                });

            }

            resetForm();

            loadData();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Operation Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    //------------------------------------------------

    const handleEdit = (campaign) => {

        setEditingCampaign(campaign);

        setName(campaign.name);

        setGroup(campaign.group);

        setMessage(campaign.message);

        setScheduleTime(

            new Date(campaign.scheduleTime)

                .toISOString()

                .slice(0, 16)

        );

    };

    //------------------------------------------------

    const handleDelete = async (id) => {

        if (

            !window.confirm(

                "Delete this Campaign?"

            )

        ) return;

        try {

            await deleteCampaign(id);

            loadData();

        }

        catch (error) {

            console.log(error);

        }

    };

    //------------------------------------------------

    const filtered = campaigns.filter(campaign =>

        campaign.name

            .toLowerCase()

            .includes(search.toLowerCase())

    );

    //------------------------------------------------

    const getGroupName = (groupId) => {

        const found = groups.find(

            group => group._id === groupId

        );

        return found ? found.name : "-";

    };

        return (

        <div className="campaign-page">

            {/* HEADER */}

            <div className="campaign-header">

                <div>

                    <h1 className="campaign-title">

                        <FiSend className="title-icon" />

                        Campaign Messages

                    </h1>

                    <p className="campaign-subtitle">

                        Send scheduled messages to an entire group

                    </p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="campaign-toolbar">

                <div className="search-box">

                    <FiSearch className="search-icon" />

                    <input

                        type="text"

                        placeholder="Search Campaign..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </div>

            </div>

            {/* CREATE / UPDATE */}

            <div className="campaign-card">

                <h3>

                    {

                        editingCampaign

                            ? "Update Campaign"

                            : "Create Campaign"

                    }

                </h3>

                <div className="campaign-form">

                    <input

                        type="text"

                        placeholder="Campaign Name"

                        value={name}

                        onChange={(e) =>

                            setName(e.target.value)

                        }

                    />

                    <select

                        value={group}

                        onChange={(e) =>

                            setGroup(e.target.value)

                        }

                    >

                        <option value="">

                            Select Group

                        </option>

                        {

                            groups.map(group => (

                                <option

                                    key={group._id}

                                    value={group._id}

                                >

                                    {group.name}

                                </option>

                            ))

                        }

                    </select>

                    <textarea

                        placeholder="Campaign Message"

                        value={message}

                        onChange={(e) =>

                            setMessage(e.target.value)

                        }

                    />

                    <input

                        type="datetime-local"

                        value={scheduleTime}

                        onChange={(e) =>

                            setScheduleTime(

                                e.target.value

                            )

                        }

                    />

                    <button

                        className="create-btn"

                        onClick={handleSubmit}

                        disabled={loading}

                    >

                        <FiPlus />

                        {

                            loading

                                ? editingCampaign

                                    ? "Updating..."

                                    : "Creating..."

                                : editingCampaign

                                    ? "Update"

                                    : "Create"

                        }

                    </button>

                </div>

            </div>

            {/* TABLE */}

            <div className="campaign-table-card">

                <table className="campaign-table">

                    <thead>

                        <tr>

                            <th>Campaign</th>

                            <th>Group</th>

                            <th>Schedule</th>

                            <th>Status</th>

                            <th>Sent</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filtered.length > 0 ?

                            filtered.map(campaign => (

                                <tr key={campaign._id}>

                                    <td>

                                        <strong>

                                            {campaign.name}

                                        </strong>

                                    </td>

                                    <td>

                                        {

                                            getGroupName(

                                                campaign.group

                                            )

                                        }

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                campaign.scheduleTime

                                            ).toLocaleString()

                                        }

                                    </td>

                                    <td>

                                        <span

                                            className={`status ${campaign.status}`}

                                        >

                                            {campaign.status}

                                        </span>

                                    </td>

                                    <td>

                                        {campaign.sentCount}

                                    </td>

                                    <td>

                                        <button

                                            className="edit-btn"

                                            onClick={() =>

                                                handleEdit(campaign)

                                            }

                                        >

                                            <FiEdit />

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                handleDelete(

                                                    campaign._id

                                                )

                                            }

                                        >

                                            <FiTrash2 />

                                        </button>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td

                                    colSpan="6"

                                    className="empty-state"

                                >

                                    No Campaigns Found

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Campaign;