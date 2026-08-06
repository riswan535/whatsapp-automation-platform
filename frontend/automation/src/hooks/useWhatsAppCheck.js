import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function useWhatsAppCheck() {

    const navigate = useNavigate();

    useEffect(() => {

        const checkWhatsApp = async () => {

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

                if (!response.data.connected) {

                    navigate("/whatsapp");

                }

            } catch (error) {

                console.log(error.response?.data);

            }

        };

        checkWhatsApp();

        const interval = setInterval(() => {

            checkWhatsApp();

        }, 3000);

        return () => clearInterval(interval);

    }, [navigate]);

}

export default useWhatsAppCheck;