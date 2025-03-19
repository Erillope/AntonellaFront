import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

interface ForgotPasswordFormProps {
    handleSubmit: () => () => void;
    buttonText: string;
    children: React.ReactNode;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ handleSubmit, buttonText, children }) => {
    return (
        <form onSubmit={handleSubmit()} className="column" style={{ width: '100%' }}>
            <InstructionsMessage />
            <div className="input-box">
                {children}
                <HaveAccountLink />
            </div>
            <Button type="submit" className="login-button">{buttonText}</Button>
        </form>
    );
}


const InstructionsMessage = () => {
    return (
        <p className="instructions-message">
            Ingrese su correo electrónico asociado a tu cuenta Antonella.
        </p>
    )
}


const HaveAccountLink = () => {
    return (
        <div>
            <Link to="/login/"
                className="link">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
        </div>
    )
}