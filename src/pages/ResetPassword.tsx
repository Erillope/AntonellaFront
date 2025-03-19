import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PasswordInputField } from "../components/PasswordInputField";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { useResetPassword } from "../hooks/useResetPassword";
import { initResetPasswordPage } from "../hooks/initPage";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { tokenId } = useParams();
    const { register, handleSubmit, errors, passwordError, confirmPasswordError,
        resetPassword } = useResetPassword(tokenId ?? "", () => navigate('/'));

    useEffect(() => initResetPasswordPage(tokenId ?? "", () => navigate('/')), [])

    return (
        <ResetPasswordForm handleSubmit={() => handleSubmit(resetPassword)}>
                <PasswordInputField register={register} errors={errors} passwordError={passwordError} />
                <PasswordInputField register={register} errors={errors} passwordError={confirmPasswordError}
                 name="confirmPassword" requiredErrorText="Es necesaria la confirmación"
                 labelText="Confirmar contraseña" />
        </ResetPasswordForm>
    );
}