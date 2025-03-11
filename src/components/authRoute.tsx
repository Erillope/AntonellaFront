import { Navigate, Outlet } from "react-router-dom";
import { AuthUserApi } from "../api/user_api";
import { useState, useEffect } from "react";

export const AuthRoute = () => {
    const authApi = new AuthUserApi();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    useEffect(() => {
        const fetchIsValid = async () => {
            setIsValid(await authApi.isValidUserCookie());
        }
        fetchIsValid();
    }, []);
    if (isValid === null) {
        return <div>Cargando...</div>;
    }
    return isValid ? <Outlet/> : <Navigate to="/login" />;
}