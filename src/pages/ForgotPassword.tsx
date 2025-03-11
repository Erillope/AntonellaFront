import { useState } from "react";
import { useForm } from 'react-hook-form';
import "../styles/Login.css";
import { TextField, Button, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthUserApi } from '../api/user_api';
import Swal from "sweetalert2";
import EmailIcon from '@mui/icons-material/Email';

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [emailError, setEmailError] = useState('');
    const authApi = new AuthUserApi();
    const [buttonText, setButtonText] = useState('Aceptar');

    const sendResetPasswordLink = async () => {
        const email = getValues('email');
        loading();
        await authApi.forgotPassword(email);
        if (verifyErrors()) return;
        showInstructions(email);
        setButtonText('Enviar de nuevo');
    }

    const verifyErrors = (): boolean => {
        clearErrors();
        if (authApi.isError('EMAIL_NOT_REGISTERED')) {
            setEmailError(authApi.getErrorMessage());
            Swal.close();
            return true;
        }
        return false;
    }

    const clearErrors = () => {
        setEmailError('');
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

    return (
        <form onSubmit={handleSubmit(sendResetPasswordLink)} className="column" style={{ width: '100%' }}>
            <p style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center', maxWidth: '400px' }}>Ingrese su correo electrónico asocidado a tu cuenta Antonella</p>
            <div style={{ paddingBottom: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
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
                                    <EmailIcon style={{color: "#AF234A"}}/>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <div >
                    <Link to="/login/"
                        className="link">¿Ya tienes una cuenta? Inicia seción aquí</Link>;
                </div>
            </div>
            <Button type="submit" className="login-button">{buttonText}</Button>
        </form>
    );
}