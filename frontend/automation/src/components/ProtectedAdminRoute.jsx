//----------------------------------------------------------------Import------------------------------------------------------------------------------------------------------

import { Navigate } from "react-router-dom";

//-----------------------------------------------------------admin protected route------------------------------------------------------------------------------------------------------

function ProtectedAdminRoute({ children }) {
 
    const token = sessionStorage.getItem("token");

    const role = sessionStorage.getItem("role");

    if(!token){

        return <Navigate to={"/"} />;
    }

    if(role !== "admin"){

        return <Navigate to={"/dashboard"} />
    }

    return children;
}

//------------------------------------------------------------------EXPORTS----------------------------------------------------------------------------------------------------

export default ProtectedAdminRoute;