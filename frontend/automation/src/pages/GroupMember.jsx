// ------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiArrowLeft,
    FiUsers,
    FiPlus,
    FiSearch,
    FiX
} from "react-icons/fi";

import { getContacts } from "../api/contactApi";

import {
    getGroupMembers,
    addContactToGroup,
    removeContactFromGroup
} from "../api/groupApi";

import "../styles/GroupMembers.css";

// ------------------------------------------------ FUNCTION ------------------------------------------------

function GroupMember() {

    useWhatsAppCheck();

    const { id } = useParams();

    const navigate = useNavigate();

    const [group, setGroup] = useState(null);

    const [contacts, setContacts] = useState([]);

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showAddMembers, setShowAddMembers] = useState(false);

    const [memberSearch, setMemberSearch] = useState("");

    const [contactSearch, setContactSearch] = useState("");

    // ------------------------------------------------

    useEffect(() => {

        loadData();

    }, []);

    // ------------------------------------------------

    const loadData = async () => {

        try {

            setLoading(true);

            const allContacts = await getContacts();

            const groupData = await getGroupMembers(id);

            setContacts(allContacts);

            setGroup(groupData.group);

            setMembers(groupData.contacts);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ------------------------------------------------

    const isMember = (contactId) => {

        return members.some(contact => contact._id === contactId);

    };

    // ------------------------------------------------

    const addMember = async (contact) => {

        try {

            await addContactToGroup(id, contact._id);

            loadData();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const removeMember = async (contact) => {

        try {

            await removeContactFromGroup(contact._id);

            loadData();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const filteredMembers = members.filter(contact =>

        contact.name
            .toLowerCase()
            .includes(memberSearch.toLowerCase()) ||

        contact.phone.includes(memberSearch)

    );

    // ------------------------------------------------

    const availableContacts = contacts.filter(contact =>

        !isMember(contact._id)

    );

    // ------------------------------------------------

    const filteredContacts = availableContacts.filter(contact =>

        contact.name
            .toLowerCase()
            .includes(contactSearch.toLowerCase()) ||

        contact.phone.includes(contactSearch)

    );

    // ------------------------------------------------

        return (

        <div className="group-members-page">

            {/* HEADER */}

            <div className="group-members-header">

                <button

                    className="back-btn"

                    onClick={() => navigate("/groups")}

                >

                    <FiArrowLeft />

                </button>

                <div>

                    <h1>

                        <FiUsers />

                        {group?.name}

                    </h1>

                    <p>

                        {group?.description || "No description"}

                    </p>

                    <span className="member-count">

                        {members.length} Members

                    </span>

                </div>

            </div>

            {/* CURRENT MEMBERS */}

            <div className="members-section">

                <div className="section-header">

                    <h2>

                        Current Members

                    </h2>

                </div>

                <div className="group-search">

                    <FiSearch className="search-icon" />

                    <input

                        type="text"

                        placeholder="Search current members..."

                        value={memberSearch}

                        onChange={(e) =>

                            setMemberSearch(e.target.value)

                        }

                    />

                </div>

                {

                    filteredMembers.length > 0 ?

                    filteredMembers.map(contact => (

                        <div

                            key={contact._id}

                            className="member-card"

                        >

                            <div>

                                <h3>

                                    {contact.name}

                                </h3>

                                <p>

                                    {contact.phone}

                                </p>

                            </div>

                            <button

                                className="remove-member-btn"

                                onClick={() =>

                                    removeMember(contact)

                                }

                            >

                                <FiX />

                                Remove

                            </button>

                        </div>

                    ))

                    :

                    <div className="empty-state">

                        No Members Found

                    </div>

                }

            </div>

            {/* ADD MEMBERS BUTTON */}

            <div className="add-member-action">

                <button

                    className="show-add-btn"

                    onClick={() =>

                        setShowAddMembers(!showAddMembers)

                    }

                >

                    <FiPlus />

                    {

                        showAddMembers ?

                        "Close"

                        :

                        "Add Members"

                    }

                </button>

            </div>

            {/* ADD MEMBERS */}

            {

                showAddMembers && (

                    <div className="add-members-section">

                        <h2>

                            Add Members

                        </h2>

                        <div className="group-search">

                            <FiSearch className="search-icon" />

                            <input

                                type="text"

                                placeholder="Search contacts..."

                                value={contactSearch}

                                onChange={(e) =>

                                    setContactSearch(e.target.value)

                                }

                            />

                        </div>

                        {

                            filteredContacts.length > 0 ?

                            filteredContacts.map(contact => (

                                <div

                                    key={contact._id}

                                    className="member-card"

                                >

                                    <div>

                                        <h3>

                                            {contact.name}

                                        </h3>

                                        <p>

                                            {contact.phone}

                                        </p>

                                    </div>

                                    <button

                                        className="add-contact-btn"

                                        onClick={() =>

                                            addMember(contact)

                                        }

                                    >

                                        <FiPlus />

                                        Add

                                    </button>

                                </div>

                            ))

                            :

                            <div className="empty-state">

                                No Contacts Available

                            </div>

                        }

                    </div>

                )

            }

        </div>

    );

}

export default GroupMember;