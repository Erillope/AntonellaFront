import { useState } from "react";
import "../styles/login.css";
import "../styles/forgotPassword.css";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { ForgotPasswordForm } from "../components/forms/ForgotPasswordForm";
import { Email } from "@mui/icons-material";
import { IconInputField } from "../components/inputs/InputTextField";

export const ForgotPassword = () => {
    const [buttonText, setButtonText] = useState('Enviar');
    const { sendResetPasswordLink, emailProps } = useForgotPassword(() => setButtonText('Enviar de nuevo'));

    return (
        <ForgotPasswordForm handleSubmit={sendResetPasswordLink} buttonText={buttonText}>
                <IconInputField labelText="Email" icon={<Email />} {...emailProps} /> 
        </ForgotPasswordForm>
    );
}