// ------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiUsers,
    FiPlus,
    FiTrash2,
    FiEdit,
    FiSearch
} from "react-icons/fi";

import {
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup
} from "../api/groupApi";

import "../styles/Groups.css";

// ------------------------------------------------ FUNCTION ------------------------------------------------

function Groups() {

    const navigate = useNavigate();

    useWhatsAppCheck();

    const [groups, setGroups] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [editingGroup, setEditingGroup] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    // ------------------------------------------------

    useEffect(() => {
        fetchGroups();
    }, []);

    // ------------------------------------------------

    const fetchGroups = async () => {

        try {

            const data = await getGroups();

            setGroups(data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const handleCreate = async () => {

        if (!name.trim()) {

            alert("Enter Group Name");

            return;

        }

        try {

            setLoading(true);

            if (editingGroup) {

                await updateGroup(editingGroup._id, {
                    name,
                    description
                });

            }

            else {

                await createGroup({
                    name,
                    description
                });

            }

            setName("");
            setDescription("");
            setEditingGroup(null);

            fetchGroups();

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

    // ------------------------------------------------

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Group?")) return;

        try {

            await deleteGroup(id);

            fetchGroups();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(
            search.toLowerCase()
        )
    );

    return (
                <div className="groups-page">

            {/* HEADER */}

            <div className="groups-header">

                <div>

                    <h1 className="groups-title">

                        <FiUsers className="title-icon" />

                        Groups

                    </h1>

                    <p className="groups-subtitle">

                        Manage your contact groups

                    </p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="groups-toolbar">

                <div className="search-box">

                    <FiSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search Group..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

            </div>

            {/* CREATE GROUP */}

            <div className="group-card">

                <h3>

                    {
                        editingGroup
                            ? "Update Group"
                            : "Create New Group"
                    }

                </h3>

                <div className="group-form">

                    <input
                        type="text"
                        placeholder="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        className="add-btn"
                        onClick={handleCreate}
                        disabled={loading}
                    >

                        <FiPlus />

                        {
                            loading
                                ? editingGroup
                                    ? "Updating..."
                                    : "Creating..."
                                : editingGroup
                                    ? "Update"
                                    : "Create"
                        }

                    </button>

                </div>

            </div>

            {/* TABLE */}

            <div className="table-card">

                <table className="groups-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Description</th>

                            <th>Created</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filtered.length > 0 ?

                                filtered.map(group => (

                                    <tr key={group._id}>

                                        <td>

                                            <strong>

                                                {group.name}

                                            </strong>

                                        </td>

                                        <td>

                                            {group.description || "-"}

                                        </td>

                                        <td>

                                            {
                                                new Date(group.createdAt)
                                                    .toLocaleDateString()
                                            }

                                        </td>

                                        <td className="group-actions">

                                            <button
                                                className="member-btn"
                                                onClick={() =>
                                                    navigate(`/groups/${group._id}`)
                                                }
                                            >

                                                View Members

                                            </button>

                                            <button
                                                className="edit-btn"
                                                onClick={() => {

                                                    setEditingGroup(group);

                                                    setName(group.name);

                                                    setDescription(group.description);

                                                }}
                                            >

                                                <FiEdit />

                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(group._id)
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
                                        colSpan="4"
                                        className="empty-state"
                                    >

                                        No Groups Found

                                    </td>

                                </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Groups;