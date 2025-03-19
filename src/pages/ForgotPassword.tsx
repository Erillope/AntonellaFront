import { useState } from "react";
import "../styles/login.css";
import "../styles/forgotPassword.css";
import { EmailInputField } from "../components/inputField/EmailInputField";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";


export const ForgotPassword = () => {
    const [buttonText, setButtonText] = useState('Aceptar');
    const { register, handleSubmit, errors, emailError,
        sendResetPasswordLink } = useForgotPassword(() => setButtonText('Aceptar'));

    return (
        <ForgotPasswordForm handleSubmit={() => handleSubmit(sendResetPasswordLink)} buttonText={buttonText}>
                <EmailInputField register={register} errors={errors} emailError={emailError}
                iconStyle={{ color: "#AF234A" }} />   
        </ForgotPasswordForm>
    );
}