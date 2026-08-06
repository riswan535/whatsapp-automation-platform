// ------------------------------------------------ IMPORTS ------------------------------------------------

import { useEffect, useState } from "react";

import useWhatsAppCheck from "../hooks/useWhatsAppCheck";

import {
    FiMessageCircle,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiRefreshCw
} from "react-icons/fi";

import {
    createAutoReply,
    getAutoReplies,
    updateAutoReply,
    deleteAutoReply
} from "../api/autoReplayApi";

import { getGroups } from "../api/groupApi";

import "../styles/AutoReply.css";

// ------------------------------------------------ FUNCTION ------------------------------------------------

function AutoReply() {

   useWhatsAppCheck();

    const [rules, setRules] = useState([]);

    const [groups, setGroups] = useState([]);

    const [group, setGroup] = useState("");

    const [keywords, setKeywords] = useState("");

    const [replyMessage, setReplyMessage] = useState("");

    const [status, setStatus] = useState(true);

    const [editingRule, setEditingRule] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    // ------------------------------------------------

    useEffect(() => {

        loadData();
        

    }, []);

    // ------------------------------------------------

    const loadData = async () => {

        try {

            const ruleData = await getAutoReplies();

            const groupData = await getGroups();

            setRules(ruleData);

            setGroups(groupData);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const resetForm = () => {

        setGroup("");

        setKeywords("");

        setReplyMessage("");

        setStatus(true);

        setEditingRule(null);

    };

    // ------------------------------------------------

    const handleSubmit = async () => {

        if (!group) {

            alert("Select Group");

            return;

        }

        if (!keywords.trim()) {

            alert("Enter Keyword");

            return;

        }

        if (!replyMessage.trim()) {

            alert("Enter Reply Message");

            return;

        }

        const payload = {

            group,

            keyword: keywords

                .split(",")

                .map(item => item.trim())

                .filter(item => item !== ""),

            replyMessage,

            status

        };

        try {

            setLoading(true);

            if (editingRule) {

                await updateAutoReply(

                    editingRule._id,

                    payload

                );

            }

            else {

                await createAutoReply(payload);

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

    // ------------------------------------------------

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this rule?"))

            return;

        try {

            await deleteAutoReply(id);

            loadData();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ------------------------------------------------

    const filteredRules = rules.filter(rule => {

        const groupName = groups.find(

            group => group._id === rule.group

        )?.name || "";

        return (

            groupName

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            rule.keyword.join(",")

                .toLowerCase()

                .includes(search.toLowerCase())

        );

    });

        return (

        <div className="autoreply-page">

            {/* HEADER */}

            <div className="autoreply-header">

                <div>

                    <h1 className="autoreply-title">

                        <FiMessageCircle className="title-icon" />

                        Auto Reply

                    </h1>

                    <p className="autoreply-subtitle">

                        Create automatic reply rules for your WhatsApp groups

                    </p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="autoreply-toolbar">

                <div className="search-box">

                    <FiSearch className="search-icon" />

                    <input

                        type="text"

                        placeholder="Search Group or Keyword..."

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                    />

                </div>

            </div>

            {/* CREATE / UPDATE */}

            <div className="autoreply-card">

                <h3>

                    {

                        editingRule

                            ? "Update Auto Reply"

                            : "Create Auto Reply"

                    }

                </h3>

                <div className="autoreply-form">

                    {/* GROUP */}

                    <select

                        value={group}

                        onChange={(e) => setGroup(e.target.value)}

                    >

                        <option value="">

                            Select Group

                        </option>

                        {

                            groups.map(item => (

                                <option

                                    key={item._id}

                                    value={item._id}

                                >

                                    {item.name}

                                </option>

                            ))

                        }

                    </select>

                    {/* KEYWORDS */}

                    <input

                        type="text"

                        placeholder="Keywords (hello,hi,test)"

                        value={keywords}

                        onChange={(e) =>

                            setKeywords(e.target.value)

                        }

                    />

                    {/* REPLY */}

                    <textarea

                        rows="4"

                        placeholder="Reply Message"

                        value={replyMessage}

                        onChange={(e) =>

                            setReplyMessage(e.target.value)

                        }

                    />

                    {/* STATUS */}

                    <div className="status-box">

                        <label>Status</label>

                        <input

                            type="checkbox"

                            checked={status}

                            onChange={(e) =>

                                setStatus(e.target.checked)

                            }

                        />

                    </div>

                    {/* BUTTONS */}

                    <div className="form-buttons">

                        <button

                            className="save-btn"

                            onClick={handleSubmit}

                            disabled={loading}

                        >

                            <FiPlus />

                            {

                                loading

                                    ? "Saving..."

                                    : editingRule

                                        ? "Update Rule"

                                        : "Create Rule"

                            }

                        </button>

                        {

                            editingRule && (

                                <button

                                    className="cancel-btn"

                                    onClick={resetForm}

                                >

                                    <FiRefreshCw />

                                    Cancel

                                </button>

                            )

                        }

                    </div>

                </div>

            </div>

            {/* TABLE */}

            <div className="table-card">

                <table className="autoreply-table">

                    <thead>

                        <tr>

                            <th>Group</th>

                            <th>Keywords</th>

                            <th>Reply</th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredRules.length > 0 ?

                            filteredRules.map(rule => (

                                <tr key={rule._id}>

                                    <td>

                                        {

                                            groups.find(

                                                group =>

                                                group._id === rule.group

                                            )?.name || "-"

                                        }

                                    </td>

                                    <td>

                                        {rule.keyword.join(", ")}

                                    </td>

                                    <td>

                                        {rule.replyMessage}

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                rule.status

                                                ? "status-active"

                                                : "status-inactive"

                                            }

                                        >

                                            {

                                                rule.status

                                                ? "Active"

                                                : "Inactive"

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            className="edit-btn"

                                            onClick={() => {

                                                setEditingRule(rule);

                                                setGroup(rule.group);

                                                setKeywords(

                                                    rule.keyword.join(",")

                                                );

                                                setReplyMessage(

                                                    rule.replyMessage

                                                );

                                                setStatus(rule.status);

                                            }}

                                        >

                                            <FiEdit />

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                handleDelete(rule._id)

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

                                    No Auto Reply Rules Found

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default AutoReply;