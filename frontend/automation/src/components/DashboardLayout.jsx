import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

function DashboardLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="layout">

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div
                className={
                    sidebarOpen
                        ? "main-content shift"
                        : "main-content"
                }
            >

                {children}

            </div>

        </div>

    );

}

export default DashboardLayout;