//--------------------------------------------------------------------------------IMPORTS--------------------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import AdminStats from "../components/AdminStats";
import "../styles/Admin.css";

//--------------------------------------------------------------------------------FUNCTION-------------------------------------------------------------------------------------------------

function Admin() {

    // Dashboard Statistics
    const [stats, setStats] = useState({

        totalUsers: 0,
        pendingUsers: 0,
        approvedUsers: 0

    });

    // User List
    const [users, setUsers] = useState([]);

    // Search
    const [search, setSearch] = useState("");

    const [loadingId, setLoadingId] = useState(null);

    //-------------------------------------------------------------------------FETCH DASHBOARD------------------------------------------------------------------------------------------------

    useEffect(() => {

        fetchDashboard();

        fetchUsers();

    }, []);

    //-------------------------------------------------------------------------GET DASHBOARD-----------------------------------------------------------------------------------------------------

    const fetchDashboard = async () => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await api.get(

                "/admin/admindash",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            console.log(response.data);

            setStats(response.data);

        }

        catch (error) {

            console.log(error.response?.data);

        }

    };

    //-------------------------------------------------------------------------GET USERS------------------------------------------------------------------------------------------------------

    const fetchUsers = async () => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await api.get(

                "/admin/getuser",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setUsers(response.data);

        }

        catch (error) {

            console.log(error.response?.data);

        }

    };

    //-------------------------------------------------------------------------SEARCH--------------------------------------------------------------------------------------------------------------

    const filteredUsers = users.filter((user) =>

        user.name.toLowerCase().includes(search.toLowerCase()) ||

        user.email.toLowerCase().includes(search.toLowerCase())

    );

    //---------------------------------------------------------------------APPROVE USER---------------------------------------------------------------------------------

   const approveUser = async(id)=>{

    try{

       setLoadingId(id);

        const token = sessionStorage.getItem("token");

        await api.put(

            `/admin/approveuser/${id}`,

            {},

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        fetchUsers();

        fetchDashboard();

    }

    catch(error){

        console.log(error.response?.data);

    }

  };

    //--------------------------------------------------------------------DELETE USER-----------------------------------------------------------------------------------------

   const deleteUser = async(id)=>{

    const confirmDelete = window.confirm(

        "Are you sure you want to delete this user?"

    );

    if(!confirmDelete){

        return;

    }

    try{

        const token = sessionStorage.getItem("token");

        await api.delete(

            `/admin/deleteuser/${id}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        fetchUsers();

        fetchDashboard();

    }

    catch(error){

        console.log(error.response?.data);

    }

    finally{

      setLoadingId(null);
    }

  }

    //------------------------------------------------------------------------RETURN-------------------------------------------------------------------------------------------------------------

    return (

        <div className="admin-page">

            <h1 className="admin-title">

                ADMIN CONTROL CENTER

            </h1>

            {/* Statistics */}

            <div className="stats-grid">

                <AdminStats

                    title="Total Users"

                    value={stats.totalUsers}

                />

                <AdminStats

                    title="Pending Users"

                    value={stats.pendingUsers}

                />

                <AdminStats

                    title="Approved Users"

                    value={stats.approvedUser}

                />

            </div>

            {/* Search */}

            <div className="search-box">

              <FiSearch className="search-icon"/>

                <input

                    type="text"

                    placeholder="Search by Name or Email"

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

            </div>

            {/* User Table */}

            <table className="user-table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Status</th>

                        <th>Role</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredUsers.map((user) => (

                            <tr key={user._id}>

                                <td>{user.name}</td>

                                <td>{user.email}</td>

                                <td>

                                    {

                                        user.isApproved

                                            ?

                                            <span className="approved">

                                                Approved

                                            </span>

                                            :

                                            <span className="pending">

                                                Pending

                                            </span>

                                    }

                                </td>

                                <td>{user.role}</td>

                                <td>

                                    {

                                        !user.isApproved && (

                                            <button onClick={() => approveUser(user._id)} 

                                           disabled={loadingId === user._id}

                                            className="btn btn-approve">

                                              {
                                                loadingId === user._id

                                                ?

                                                "Approving..."

                                                :

                                                "Approve"
                                                
                                              }

                                              
    
                                            </button>

                                        )

                                    }

                                    <button onClick={() => deleteUser(user._id)} className="btn btn-delete">

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

//--------------------------------------------------------------------------------EXPORT------------------------------------------------------------------------------------------------------

export default Admin;