//------------------------------------------------------------IMPORTS----------------------------------------------------------------------------------------------

import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";
import api from "../api/axios";

//-------------------------------------------------------------FUNCTIONS----------------------------------------------------------------------------------------------

function Login() {

    const Navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    //------------------------------------------------------------LOGIN FUNCTION----------------------------------------------------------------------------------------------

    const handleLogin = async () => {

        //--------------------------------------------------
        // Validation
        //--------------------------------------------------

        if (!email.trim()) {

            setMessage("Email is required");

            return;

        }

        if (!password.trim()) {

            setMessage("Password is required");

            return;

        }

        try {

            setLoading(true);

            setMessage("");

            const response = await api.post("/auth/login", {

                email,

                password

            });

            //--------------------------------------------------
            // Save Token
            //--------------------------------------------------

            sessionStorage.setItem(

                "token",

                response.data.token

            );

            sessionStorage.setItem(

                "role",

                response.data.role

            );

            //--------------------------------------------------
            // Admin
            //--------------------------------------------------

            if (response.data.role === "admin") {

                Navigate("/admin");

            }

            //--------------------------------------------------
            // User
            //--------------------------------------------------

            else {

                const status = await api.get(

                    "/whatsapp/status",

                    {

                        headers: {

                            Authorization: `Bearer ${response.data.token}`

                        }

                    }

                );

                if (status.data.connected) {

                    Navigate("/dashboard");

                }

                else {

                    Navigate("/whatsapp");

                }

            }

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

        //------------------------------------------------------------RETURN----------------------------------------------------------------------------------------------

    return (

        <div className="login-page">

            {/* Background Blobs */}

            <div className="blob blob1"></div>

            <div className="blob blob2"></div>

            <div className="blob blob3"></div>

            {/* Login Card */}

            <div className="login-card">

                <h1 className="title">

                    AUTOMATE

                </h1>

                <p className="subtitle">

                    WhatsApp Automation Platform

                </p>

                {/* EMAIL */}

                <div className="input-group">

                    <label>Email</label>

                    <input

                        type="email"

                        placeholder="Enter your email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                    />

                </div>

                {/* PASSWORD */}

                <div className="input-group">

                    <label>Password</label>

                    <input

                        type="password"

                        placeholder="Enter your password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                    />

                </div>

                {/* MESSAGE */}

                {

                    message &&

                    <p className="message">

                        {message}

                    </p>

                }

                {/* LOGIN BUTTON */}

                <button

                    className="login-btn"

                    onClick={handleLogin}

                    disabled={loading}

                >

                    {

                        loading

                            ?

                            "Logging in..."

                            :

                            "LOGIN"

                    }

                </button>

                {/* REGISTER LINK */}

                <p className="register-text">

                    Don't have an account?

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

//------------------------------------------------------------EXPORT----------------------------------------------------------------------------------------------

export default Login;