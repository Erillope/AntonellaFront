import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface LoginFormProps {
    handleSubmit: () => () => void;
    children: React.ReactNode;
}

export const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, children }) => {
    return (
        <form onSubmit={handleSubmit()} className="column" style={{ width: '100%' }}>
            <div className="login-box">
                {children}
                <ForgotPasswordLink />
            </div>
            <Button type="submit" className="login-button">Ingresar</Button>
        </form>
    )
}


const ForgotPasswordLink = () => {
    return (
        <div style={{ width: '60%', position: 'relative' }}>
            <Link to="/password/reset/" style={{ position: 'absolute', right: 0 }}
                className="link">¿Has olvidado tu contraseña?</Link>
        </div>
    )
}