import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PasswordInputField } from "../components/inputs/InputTextField";
import { useResetPassword } from "../hooks/useResetPassword";
import { FormBox, SubmitButton } from "../components/forms/FormBox";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { tokenId } = useParams();
    const { resetPassword, init, passwordProps, confirmPasswordProps } = useResetPassword(tokenId ?? "", () => navigate('/'));

    useEffect(init, [])

    return (
        <FormBox handleSubmit={resetPassword} submitChildren={<SubmitButton text="Aceptar" />}>
                <PasswordInputField labelText="Contraseña" {...passwordProps} />
                <PasswordInputField labelText="Confirmar contraseña" {...confirmPasswordProps} />
        </FormBox>
    );
}