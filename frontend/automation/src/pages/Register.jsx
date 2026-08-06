//------------------------------------------------------------IMPORTS---------------------------------------------------------------------------------------------------------------------------------------------------

import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import "../styles/Register.css"

//------------------------------------------------------------FUNCTIONS----------------------------------------------------------------------------------------------------------------------------------

function Register() {

  const navigate  = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

//---------------------------------------------------------REGISTER FUNCTION-------------------------------------------------------------------------------------------------------------------------------------

const handleRegister = async () =>{

  if(password !== confirmPassword){

    setMessage("Password do not match");

    return;

  }

  try{

    setLoading(true);

    const response = await api.post("/auth/register",{

      name,
      email,
      password

    });

    setMessage(response.data.message);

    setTimeout(() => {

      navigate("/")

    },2000);

  }catch(error){

    setMessage(error.response?.data?.message);

  }

  finally{

    setLoading(false);

  }

}

//-------------------------------------------------------RETURN [shown in browser]---------------------------------------------------------------------------------------------------------------

return (

<div className="register-page">

    <div className="blob blob1"></div>
    <div className="blob blob2"></div>
    <div className="blob blob3"></div>

    <div className="register-card">

        <h1 className="title">

            CREATE ACCOUNT

        </h1>

        <p className="subtitle">

            Register to continue

        </p>

        <div className="input-group">

            <label>Name</label>

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />

        </div>

        <div className="input-group">

            <label>Email</label>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

        </div>

        <div className="input-group">

            <label>Password</label>

            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />

        </div>

        <div className="input-group">

            <label>Confirm Password</label>

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
            />

        </div>

        {

            message &&

            <p className="message">

                {message}

            </p>

        }

        <button
            className="register-btn"
            onClick={handleRegister}
            disabled={loading}
        >

            {

                loading

                ?

                "Registering..."

                :

                "REGISTER"

            }

        </button>

        <p className="login-text">

            Already have an account?

            <Link to="/">

                Login

            </Link>

        </p>

    </div>

</div>

);

}
//------------------------------------------------------------EXPORTS-------------------------------------------------------------------------------------------------------------------------

export default Register;