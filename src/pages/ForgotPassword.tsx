import { useState } from "react";
import { FieldErrors, useForm } from 'react-hook-form';
import "../styles/login.css";
import "../styles/forgotPassword.css";
import { TextField, Button, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthUserApi } from '../api/user_api';
import Swal from "sweetalert2";
import EmailIcon from '@mui/icons-material/Email';

export const ForgotPassword = () => {
    const [buttonText, setButtonText] = useState('Aceptar');
    const { register, handleSubmit, errors, emailError, sendResetPasswordLink } = useForgotPassword(setButtonText);

    return (
        <form onSubmit={handleSubmit(sendResetPasswordLink)} className="column" style={{ width: '100%' }}>
            {instructions()}
            <div className="input-box">
                {emailInput(register, errors, emailError)}
                {haveAccount()}
            </div>
            <Button type="submit" className="login-button">{buttonText}</Button>
        </form>
    );
}

const instructions = () => {
    return (
        <p className="instructions-message">
            Ingrese su correo electrónico asociado a tu cuenta Antonella.
        </p>
    )
}

const haveAccount = () => {
    return (
        <div>
            <Link to="/login/"
                className="link">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
        </div>
    )
}


const emailInput = (register: ReturnType<typeof useForm>["register"], errors: FieldErrors,
    emailError: string) => {
    return (
        <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            className="input"
            {...register('email', { required: 'El email es obligatorio' })}
            error={!!errors.email || !!(emailError.length > 0)}
            helperText={typeof errors.email?.message === 'string' ? errors.email.message : emailError}
            type="email"
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <EmailIcon style={{ color: "#AF234A" }} />
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}


const useForgotPassword = (setButtonText: (text: string) => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [emailError, setEmailError] = useState('');
    const authApi = new AuthUserApi();

    const sendResetPasswordLink = async () => {
        const email = getValues('email');
        loading();
        await authApi.forgotPassword(email);
        if (verifyErrors(authApi, setEmailError)) return;
        showInstructions(email);
        setButtonText('Enviar de nuevo');
    }

    return {
        register,
        handleSubmit,
        errors,
        emailError,
        sendResetPasswordLink
    }
}


const verifyErrors = (authApi: AuthUserApi, setEmailError: (error: string) => void): boolean => {
    setEmailError('');
    if (authApi.isError('EMAIL_NOT_REGISTERED')) {
        setEmailError(authApi.getErrorMessage());
        Swal.close();
        return true;
    }
    return false;
}


const showInstructions = (email: string) => {
    Swal.fire({
        title: "Instrucciones Enviadas",
        text: `Hemos enviado instrucciones para cambiar tu contraseña a ${email}. Por favor revise su bandeja de entrada y la carpeta de spam.`,
        icon: "success",
        confirmButtonText: "OK"
    });
}


const loading = () => {
    Swal.fire({
        title: "Enviando correo de verificación...",
        text: "Esto puede tardar unos segundos",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}