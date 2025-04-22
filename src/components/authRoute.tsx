import { Navigate, Outlet } from "react-router-dom";
import { AuthUserApi } from "../api/user_api";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

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
        return <CircularProgress style={{color: '#F44565'}}/>;
    }
    return isValid ? <Outlet/> : <Navigate to="/login" />;
}