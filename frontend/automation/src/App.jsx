//-----------------------------------------------------------------IMPORT---------------------------------------------------------------------------------------------

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Contacts from "./pages/Contacts";
import Groups from "./pages/Groups";
import GroupMember from "./pages/GroupMember";
import WhatsApp from "./pages/WhatsApp";
import AutoReply from "./pages/AutoReply";
import Schedule from "./pages/Schedule";
import Campaign from "./pages/Campaign";


import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/ProtectedAdminRoute";
import DashboardLayout from "./components/DashboardLayout";

//--------------------------------------------------------------REACT ROUTER - DOM------------------------------------------------------------------------------------------------

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* WhatsApp Connection Page */}

        <Route
          path="/whatsapp"
          element={
            <ProtectedRoute>
              <WhatsApp />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Contacts */}

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Contacts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Groups */}

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Groups />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Auto Reply */}

        <Route
          path="/autoreply"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AutoReply />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Schedule */}

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Schedule />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Campaign */}

        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Campaign />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />

        {/* Group Members */}

        <Route
    path="/groups/:id"
    element={
        <ProtectedRoute>
            <DashboardLayout>
                <GroupMember />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>

      </Routes>

      

    </BrowserRouter>

  );

}

//-------------------------------------------------------------------EXPORT-------------------------------------------------------------------------------------------

export default App;