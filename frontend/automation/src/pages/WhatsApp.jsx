//------------------------------------------------IMPORTS------------------------------------------------

import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/WhatsApp.css";
import { useNavigate } from "react-router-dom";

//------------------------------------------------FUNCTION------------------------------------------------

function WhatsApp() {

    const Navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [qr, setQr] = useState("");
    const [loading, setLoading] = useState(false);

    //------------------------------------------------STATUS------------------------------------------------

    const getStatus = async () => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await api.get(
                "/whatsapp/status",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStatus(response.data.connected);
            setNumber(response.data.number || "");
            setName(response.data.pushName || "");

        }

        catch (error) {

            console.log(error.response?.data);

        }

    };

    //------------------------------------------------GET QR------------------------------------------------

    const getQR = async () => {

        try {

            const token = sessionStorage.getItem("token");

            const response = await api.get(
                "/whatsapp/qr",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.qr) {

                setQr(response.data.qr);

            }

        }

        catch (error) {

            console.log(error.response?.data);

        }

    };

    //------------------------------------------------CONNECT------------------------------------------------

    const connectWhatsApp = async () => {

        try {

            setLoading(true);

            const token = sessionStorage.getItem("token");

            await api.post(
                "/whatsapp/connect",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getQR();

        }

        catch (error) {

            console.log(error.response?.data);

        }

        finally {

            setLoading(false);

        }

    };

    //------------------------------------------------DISCONNECT------------------------------------------------

    const disconnectWhatsApp = async () => {

        try {

            setLoading(true);

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

            setStatus(false);
            setQr("");
            setNumber("");
            setName("");

        }

        catch (error) {

            console.log(error.response?.data);

        }

        finally {

            setLoading(false);

        }

    };

    //------------------------------------------------USE EFFECT------------------------------------------------

    useEffect(() => {

        getStatus();

        const interval = setInterval(() => {

            getStatus();

            if (!status) {

                getQR();

            }

        }, 2000);

        return () => clearInterval(interval);

    }, [status]);

    useEffect(() => {

    if (status) {

        Navigate("/dashboard");

    }

}, [status, Navigate]);

    //------------------------------------------------RETURN------------------------------------------------

    return (

        <div className="whatsapp-page">

            <h1 className="whatsapp-title">

                WhatsApp Connection

            </h1>

            {/* STATUS CARD */}

            <div className="status-card">

                <h3>Status</h3>

                {

                    status ?

                        <p className="connected">

                            🟢 Connected

                        </p>

                        :

                        <p className="disconnected">

                            🔴 Disconnected

                        </p>

                }

                {

                    status &&

                    <>

                        <p>

                            <strong>Name :</strong> {name}

                        </p>

                        <p>

                            <strong>Number :</strong> {number}

                        </p>

                    </>

                }

            </div>

            {/* WAITING */}

            {

                !status && !qr &&

                <div className="waiting-card">

                    <h3>

                        Waiting For QR...

                    </h3>

                    <p>

                        Click Connect to generate a QR Code.

                    </p>

                </div>

            }

            {/* QR */}

            {

                !status && qr &&

                <div className="qr-card">

                    <h3>

                        Scan QR Code

                    </h3>

                    <img
                        src={qr}
                        alt="QR Code"
                    />

                    <p>

                        Open WhatsApp → Linked Devices → Scan QR

                    </p>

                </div>

            }

            {/* BUTTON */}

            <div className="button-group">

                {

                    status ?

                        <button
                            className="disconnect-btn"
                            onClick={disconnectWhatsApp}
                            disabled={loading}
                        >

                            {

                                loading ?

                                    "Disconnecting..."

                                    :

                                    "Disconnect WhatsApp"

                            }

                        </button>

                        :

                        <button
                            className="connect-btn"
                            onClick={connectWhatsApp}
                            disabled={loading}
                        >

                            {

                                loading ?

                                    "Connecting..."

                                    :

                                    "Connect WhatsApp"

                            }

                        </button>

                }

            </div>

        </div>

    );

}

//------------------------------------------------EXPORT------------------------------------------------

export default WhatsApp;