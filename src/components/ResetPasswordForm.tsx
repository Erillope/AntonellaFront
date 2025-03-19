import "../styles/login.css"
import { Button } from "@mui/material"
import React from "react";

interface ResetPasswordFormProps {
    handleSubmit: () => () => void;
    children: React.ReactNode;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ handleSubmit, children }) => {
    return (
        <form onSubmit={handleSubmit()} className="column" style={{ width: '100%' }}>
            <div className="input-box">
                {children}
            </div>
            <Button type="submit" className="login-button">Aceptar</Button>
        </form>
    )
}