// ------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";
import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiCalendar,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiSearch
} from "react-icons/fi";

import { getContacts } from "../api/contactApi";

import {
    createSchedule,
    getSchedules,
    updateSchedule,
    deleteSchedule
} from "../api/scheduleApi";

import "../styles/Schedule.css";

// ------------------------------------------------ FUNCTION ------------------------------------------------

function Schedule() {

   useWhatsAppCheck();

    const [contacts, setContacts] = useState([]);

    const [schedules, setSchedules] = useState([]);

    const [contactId, setContactId] = useState("");

    const [message, setMessage] = useState("");

    const [scheduleTime, setScheduleTime] = useState("");

    const [editingSchedule, setEditingSchedule] = useState(null);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    // ------------------------------------------------

    useEffect(() => {

        loadData();

    }, []);

    // ------------------------------------------------

    const loadData = async () => {

        try {

            const contactData = await getContacts();

            const scheduleData = await getSchedules();

            setContacts(contactData);

            setSchedules(scheduleData);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const handleSubmit = async () => {

        if (
            !contactId ||
            !message ||
            !scheduleTime
        ) {

            alert("Fill all fields");

            return;

        }

        try {

            setLoading(true);

            if (editingSchedule) {

                await updateSchedule(

                    editingSchedule._id,

                    {

                        contactId,

                        message,

                        scheduleTime,

                        status: editingSchedule.status

                    }

                );

            }

            else {

                await createSchedule({

                    contactId,

                    message,

                    scheduleTime

                });

            }

            clearForm();

            loadData();

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ------------------------------------------------

    const handleDelete = async (id) => {

        if (

            !window.confirm(

                "Delete this Schedule?"

            )

        ) return;

        try {

            await deleteSchedule(id);

            loadData();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const clearForm = () => {

        setContactId("");

        setMessage("");

        setScheduleTime("");

        setEditingSchedule(null);

    };

    // ------------------------------------------------

    const getContactName = (id) => {

        const contact = contacts.find(

            item => item._id === id

        );

        return contact

            ? contact.name

            : "Unknown";

    };

    // ------------------------------------------------

    const formatDate = (date) => {

        return new Date(date)

            .toLocaleString(

                "en-IN",

                {

                    day: "2-digit",

                    month: "short",

                    year: "numeric",

                    hour: "2-digit",

                    minute: "2-digit"

                }

            );

    };

    // ------------------------------------------------

    const filteredSchedules = schedules.filter(

        schedule =>

            getContactName(

                schedule.contact

            )

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

            ||

            schedule.message

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

    );

        return (

        <div className="schedule-page">

            {/* HEADER */}

            <div className="schedule-header">

                <div>

                    <h1>

                        <FiCalendar />

                        Schedule Messages

                    </h1>

                    <p>

                        Schedule WhatsApp messages to your contacts

                    </p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="schedule-toolbar">

                <div className="search-box">

                    <FiSearch className="search-icon" />

                    <input

                        type="text"

                        placeholder="Search schedule..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </div>

            </div>

            {/* FORM */}

            <div className="schedule-card">

                <h3>

                    {

                        editingSchedule

                            ? "Update Schedule"

                            : "Create Schedule"

                    }

                </h3>

                <div className="schedule-form">

                    <select

                        value={contactId}

                        onChange={(e) =>

                            setContactId(e.target.value)

                        }

                    >

                        <option value="">

                            Select Contact

                        </option>

                        {

                            contacts.map(contact => (

                                <option

                                    key={contact._id}

                                    value={contact._id}

                                >

                                    {contact.name}

                                </option>

                            ))

                        }

                    </select>

                    <textarea

                        placeholder="Message"

                        value={message}

                        onChange={(e) =>

                            setMessage(e.target.value)

                        }

                    />

                    <input

                        type="datetime-local"

                        value={scheduleTime}

                        onChange={(e) =>

                            setScheduleTime(e.target.value)

                        }

                    />

                    <button

                        className="add-btn"

                        onClick={handleSubmit}

                        disabled={loading}

                    >

                        <FiPlus />

                        {

                            loading

                                ? "Saving..."

                                : editingSchedule

                                ? "Update"

                                : "Create"

                        }

                    </button>

                </div>

            </div>

            {/* TABLE */}

            <div className="table-card">

                <table className="schedule-table">

                    <thead>

                        <tr>

                            <th>Contact</th>

                            <th>Message</th>

                            <th>Schedule Time</th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredSchedules.length > 0 ?

                            filteredSchedules.map(schedule => (

                                <tr key={schedule._id}>

                                    <td>

                                        {

                                            getContactName(

                                                schedule.contact

                                            )

                                        }

                                    </td>

                                    <td>

                                        {schedule.message}

                                    </td>

                                    <td>

                                        {

                                            formatDate(

                                                schedule.scheduleTime

                                            )

                                        }

                                    </td>

                                    <td>

                                        <span

                                            className={`status ${schedule.status}`}

                                        >

                                            {

                                                schedule.status

                                            }

                                        </span>

                                    </td>

                                    <td className="schedule-actions">

                                        <button

                                            className="edit-btn"

                                            onClick={() => {

                                                setEditingSchedule(schedule);

                                                setContactId(

                                                    schedule.contact

                                                );

                                                setMessage(

                                                    schedule.message

                                                );

                                                setScheduleTime(

                                                    schedule.scheduleTime

                                                        .slice(0,16)

                                                );

                                            }}

                                        >

                                            <FiEdit />

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                handleDelete(

                                                    schedule._id

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

                                    colSpan="5"

                                    className="empty-state"

                                >

                                    No Scheduled Messages

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Schedule;