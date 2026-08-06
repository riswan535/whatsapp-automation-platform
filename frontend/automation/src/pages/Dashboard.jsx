// ----------------------------------------------------------- IMPORTS ---------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import useWhatsAppCheck from "../hooks/useWhatsAppCheck";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


import {
    FiLogOut,
    FiPower,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiMessageCircle,
    FiRadio,
    FiSend,
    FiUpload,
    FiUsers
} from "react-icons/fi";

import "../styles/Dashboard.css";

// ----------------------------------------------------------- FUNCTION -----------------------------------------------------------------------------------------

function Dashboard() {

    const Navigate = useNavigate();

    useWhatsAppCheck();

    const [disconnectLoading, setDisconnectLoading] = useState(false);

    const [dashboard, setDashboard] = useState({

        totalContacts: 0,

        totalCampaign: 0,

        pendingCampaign: 0,

        completedCampaign: 0,

        totalSchedule: 0,

        pendingSchedule: 0,

        completedSchedule: 0,

        totalAutoReplay: 0,

        liveAutoReplay: 0,

        incommingMSG: 0,

        outgoingMSG: 0

    });

    //-----------------------------------------------------------------FETCH DASHBOARD DATA------------------------------------------------------------------------------------------------------------

    useEffect(() => {

        fetchDashboard();

    }, []);


    //----------------------------------------------------------------FETCH DASHBOARD------------------------------------------------------------------------------------------------------------

    const fetchDashboard = async () => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await api.get("/dashboard", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setDashboard(response.data);

        }

        catch (error) {

            console.log(error.response?.data);

        }

    };

    //----------------------------------------------------------------DISCONNECT WHATSAPP------------------------------------------------------------------------------------------------------------

    const disconnectWhatsApp = async () => {

    try {

        setDisconnectLoading(true);

        const token = sessionStorage.getItem("token");

        await api.post(

            "/whatsapp/disconnect",

            {},

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert("WhatsApp Disconnected Successfully");

        Navigate("/whatsapp");

    }

    catch (error) {

        console.log(error.response?.data);

        alert("Unable to Disconnect WhatsApp");

    }

    finally {

        setDisconnectLoading(false);

    }

};

    //----------------------------------------------------------------LOGOUT------------------------------------------------------------------------------------------------------------

    const logout = () => {

        sessionStorage.removeItem("token");

        sessionStorage.removeItem("role");

        Navigate("/");

    };

        //-----------------------------------------------------------------------RETURN------------------------------------------------------------------------------------------

    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <h1 className="dashboard-title">

                    USER DASHBOARD

                </h1>

                <div className="dashboard-actions">

                    <button

                        className="disconnect-btn"

                        onClick={disconnectWhatsApp}

                        disabled={disconnectLoading}

                    >

                        <FiPower />

                        {

                            disconnectLoading

                            ? "Disconnecting..."

                            : "Disconnect WhatsApp"
                            
                        }

                    </button>

                    <button

                        className="logout-btn"

                        onClick={logout}

                    >

                        <FiLogOut />

                        Logout

                    </button>

                </div>

            </div>

            <div className="dashboard-grid">

                <DashboardCard
                    title="Contacts"
                    value={dashboard.totalContacts}
                    icon={<FiUsers />}
                />

                <DashboardCard
                    title="Total Campaigns"
                    value={dashboard.totalCampaign}
                    icon={<FiSend />}
                />

                <DashboardCard
                    title="Pending Campaign"
                    value={dashboard.pendingCampaign}
                    icon={<FiClock />}
                />

                <DashboardCard
                    title="Completed Campaign"
                    value={dashboard.completedCampaign}
                    icon={<FiCheckCircle />}
                />

                <DashboardCard
                    title="Total Schedule"
                    value={dashboard.totalSchedule}
                    icon={<FiCalendar />}
                />

                <DashboardCard
                    title="Pending Schedule"
                    value={dashboard.pendingSchedule}
                    icon={<FiClock />}
                />

                <DashboardCard
                    title="Completed Schedule"
                    value={dashboard.completedSchedule}
                    icon={<FiCheckCircle />}
                />

                <DashboardCard
                    title="Total Auto Reply"
                    value={dashboard.totalAutoReplay}
                    icon={<FiMessageCircle />}
                />

                <DashboardCard
                    title="Live Auto Reply"
                    value={dashboard.liveAutoReplay}
                    icon={<FiRadio />}
                />

                <DashboardCard
                    title="Incoming Messages"
                    value={dashboard.incommingMSG}
                    icon={<FiDownload />}
                />

                <DashboardCard
                    title="Outgoing Messages"
                    value={dashboard.outgoingMSG}
                    icon={<FiUpload />}
                />

            </div>

        </div>

    );

}

// ----------------------------------------------------------------- EXPORT ------------------------------------------------------------------------------------

export default Dashboard;