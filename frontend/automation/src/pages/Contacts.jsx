// ------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";

import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiTrash2,
    FiUsers
} from "react-icons/fi";

import {
    getContacts,
    addContact,
    deleteContact,
    deleteSelectedContacts,
    syncContacts
} from "../api/contactApi";

import "../styles/Contacts.css";

// ------------------------------------------------ FUNCTION ------------------------------------------------

function Contacts() {

    useWhatsAppCheck();

    const [contacts, setContacts] = useState([]);

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [countryCode, setCountryCode] = useState("+91");

    const [search, setSearch] = useState("");

    const [selectedContacts, setSelectedContacts] = useState([]);

    const [syncInfo, setSyncInfo] = useState(null);

    const [adding, setAdding] = useState(false);

    const [syncing, setSyncing] = useState(false);

    const [deleting, setDeleting] = useState(false);

    //-------------------------------------------------------

    useEffect(() => {

        fetchContacts();

    }, []);

    //-------------------------------------------------------

    const fetchContacts = async () => {

        try {

            const data = await getContacts();

            setContacts(data);

        }

        catch (error) {

            console.log(error);

        }

    };

    //-------------------------------------------------------

    const handleAdd = async () => {

        if (!name.trim() || !phone.trim()) {

            alert("Please fill all fields");

            return;

        }

        const fullPhone = countryCode.replace("+", "") + phone;

        const exists = contacts.some(

            contact => contact.phone === fullPhone

        );

        if (exists) {

            alert("Contact already exists");

            return;

        }

        try {

            setAdding(true);

            await addContact({

                name,

                phone: fullPhone

            });

            setName("");

            setPhone("");

            setCountryCode("+91");

            fetchContacts();

        }

        catch (error) {

            alert(error.response?.data?.message || "Unable to add contact");

        }

        finally {

            setAdding(false);

        }

    };

    //-------------------------------------------------------

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this contact?"))

            return;

        try {

            await deleteContact(id);

            fetchContacts();

        }

        catch (error) {

            console.log(error);

        }

    };

    //-------------------------------------------------------

    const handleSync = async () => {

        try {

            setSyncing(true);

            const result = await syncContacts();

            setSyncInfo(result);

            fetchContacts();

        }

        catch (error) {

            alert(error.response?.data?.message || "Sync Failed");

        }

        finally {

            setSyncing(false);

        }

    };

    //-------------------------------------------------------

    const filtered = contacts.filter(contact =>

        contact.name.toLowerCase().includes(search.toLowerCase()) ||

        contact.phone.includes(search)

    );

    //-------------------------------------------------------

    const toggleContact = (id) => {

        if (selectedContacts.includes(id)) {

            setSelectedContacts(

                selectedContacts.filter(contactId =>

                    contactId !== id

                )

            );

        }

        else {

            setSelectedContacts([

                ...selectedContacts,

                id

            ]);

        }

    };

    //-------------------------------------------------------

    const handleSelectAll = () => {

        if (selectedContacts.length === filtered.length) {

            setSelectedContacts([]);

        }

        else {

            setSelectedContacts(

                filtered.map(contact => contact._id)

            );

        }

    };

    //-------------------------------------------------------

    const handleDeleteSelected = async () => {

    if (selectedContacts.length === 0) {

        alert("Select contacts first");

        return;

    }

    if (
        !window.confirm(
            `Delete ${selectedContacts.length} selected contacts?`
        )
    ) {
        return;
    }

    try {

        setDeleting(true);

        const batchSize = 500;

        for (let i = 0; i < selectedContacts.length; i += batchSize) {

            const batch = selectedContacts.slice(i, i + batchSize);

            await deleteSelectedContacts(batch);

        }

        alert("Contacts deleted successfully");

        setSelectedContacts([]);

        fetchContacts();

    }

    catch (error) {

        console.log(error);

        alert(error.response?.data?.message || "Delete Failed");

    }

    finally {

        setDeleting(false);

    }

};

    return (

<div className="contacts-page">

    {/* HEADER */}

    <div className="contacts-header">

        <div>

            <h1 className="contacts-title">

                <FiUsers className="title-icon" />

                Contacts

            </h1>

            <p className="contacts-subtitle">

                Manage your manual and WhatsApp synced contacts

            </p>

        </div>

    </div>

    {/* TOOLBAR */}

    <div className="contacts-toolbar">

        <div className="search-box">

            <FiSearch className="search-icon" />

            <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

        </div>

        <div className="toolbar-actions">

            <button
                className="sync-btn"
                onClick={handleSync}
                disabled={syncing}
            >

                <FiRefreshCw />

                {syncing ? "Syncing..." : "Sync WhatsApp"}

            </button>

            {

                selectedContacts.length > 0 && (

                    <button
                        className="delete-selected-btn"
                        onClick={handleDeleteSelected}
                        disabled={deleting}
                    >

                        <FiTrash2 />
                        {deleting

                        ? "Deleting..."
                        : `Delete Selected (${selectedContacts.length})`

                        }

                    </button>

                )

            }

        </div>

    </div>

    {/* ADD CONTACT */}

    <div className="add-contact-card">

        <h3>Add New Contact</h3>

        <div className="add-contact-form">

            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <div className="phone-input">

                <select
                    className="country-code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                >

                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+968">🇴🇲 +968</option>
                    <option value="+973">🇧🇭 +973</option>

                </select>

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    maxLength={15}
                    onChange={(e) => {

                        const value = e.target.value.replace(/\D/g, "");

                        setPhone(value);

                    }}
                />

            </div>

            <button
                className="add-btn"
                onClick={handleAdd}
                disabled={adding}
            >

                <FiPlus />

                {adding ? "Adding..." : "Add Contact"}

            </button>

        </div>

    </div>

    {/* TABLE */}

    <div className="table-card">

        <table className="contacts-table">

            <thead>

                <tr>

                    <th>

                        <input
                            type="checkbox"
                            checked={
                                filtered.length > 0 &&
                                selectedContacts.length === filtered.length
                            }
                            onChange={handleSelectAll}
                        />

                    </th>

                    <th>Name</th>

                    <th>Phone</th>

                    <th>Source</th>

                    <th>Group</th>

                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {

                    filtered.length > 0 ?

                    filtered.map(contact => (

                        <tr key={contact._id}>

                            <td>

                                <input
                                    type="checkbox"
                                    checked={selectedContacts.includes(contact._id)}
                                    onChange={() => toggleContact(contact._id)}
                                />

                            </td>

                            <td className="contact-name">

                                {contact.name}

                            </td>

                            <td>

                                {contact.phone}

                            </td>

                            <td>

                                <span className={`source-badge ${contact.source}`}>

                                    {contact.source}

                                </span>

                            </td>

                            <td>

                                {contact.group ? contact.group.name : "—"}

                            </td>

                            <td>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(contact._id)}
                                >

                                    <FiTrash2 />

                                </button>

                            </td>

                        </tr>

                    ))

                    :

                    (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-state"
                            >

                                No Contacts Found

                            </td>

                        </tr>

                    )

                }

            </tbody>

        </table>

    </div>

    {/* SYNC RESULT */}

    {

        syncInfo && (

            <div className="sync-overlay">

                <div className="sync-modal">

                    <h2>WhatsApp Sync Completed</h2>

                    <div className="sync-stats">

                        <div>

                            <strong>

                                {syncInfo.totalContacts || syncInfo.totalChats}

                            </strong>

                            <span>Total Contacts</span>

                        </div>

                        <div>

                            <strong>

                                {syncInfo.saved}

                            </strong>

                            <span>New Contacts</span>

                        </div>

                        <div>

                            <strong>

                                {syncInfo.skipped}

                            </strong>

                            <span>Skipped</span>

                        </div>

                    </div>

                    <button
                        className="close-sync-btn"
                        onClick={() => setSyncInfo(null)}
                    >

                        Close

                    </button>

                </div>

            </div>

        )

    }

</div>

);

}

export default Contacts;