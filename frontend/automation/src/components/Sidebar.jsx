import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    FiMenu,
    FiHome,
    FiUsers,
    FiGrid,
    FiMessageCircle,
    FiCalendar,
    FiSend
} from "react-icons/fi";

import "../styles/Sidebar.css";

function Sidebar({ open, setOpen }) {  

    return (

        <aside className={open ? "sidebar open" : "sidebar"}>

            <div
                className="sidebar-top"
                onClick={() => setOpen(!open)}
            >

                <FiMenu className="menu-icon" />

                {open && (

                    <h2 className="sidebar-logo">

                        WhatsApp CRM

                    </h2>

                )}

            </div>

            <nav className={open ? "sidebar-menu show" : "sidebar-menu"}>

                <NavLink to="/dashboard" className="sidebar-link">

                    <FiHome />

                    <span>Dashboard</span>

                </NavLink>

                <NavLink to="/contacts" className="sidebar-link">

                    <FiUsers />

                    <span>Contacts</span>

                </NavLink>

                <NavLink to="/groups" className="sidebar-link">

                    <FiGrid />

                    <span>Groups</span>

                </NavLink>

                <NavLink to="/autoreply" className="sidebar-link">

                    <FiMessageCircle />

                    <span>Auto Reply</span>

                </NavLink>

                <NavLink to="/schedule" className="sidebar-link">

                    <FiCalendar />

                    <span>Schedule</span>

                </NavLink>

                <NavLink to="/campaigns" className="sidebar-link">

                    <FiSend />

                    <span>Campaigns</span>

                </NavLink>

            </nav>

        </aside>

    );

}

export default Sidebar;