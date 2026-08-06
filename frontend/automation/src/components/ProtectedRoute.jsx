import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

    const token = sessionStorage.getItem("token");

    const role = sessionStorage.getItem("role");

    if(!token) {

        return <Navigate to="/" replace/>
    }

    if(role === "admin"){

        return <Navigate to={"/admin"} />
    }

    return children;
}    



export default ProtectedRoute
