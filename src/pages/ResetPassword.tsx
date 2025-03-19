import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { AuthUserApi, User } from '../api/user_api'
import { TokenApi } from "../api/token_api";
import "../styles/login.css";
import "../styles/forgotPassword.css";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { tokenId } = useParams();
    const { register, handleSubmit, errors, passwordError, confirmPasswordError,
        resetPassword } = useResetPassword(tokenId ?? "", navigate);
    const tokenApi = new TokenApi();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => initPage(tokenApi, tokenId ?? "", navigate), [])

    return (
        <form onSubmit={handleSubmit(resetPassword)} className="column" style={{ width: '100%' }}>
            <div className="input-box">
                {passwordInputs(showPassword, setShowPassword, register, errors,passwordError, confirmPasswordError)}
            </div>
            <Button type="submit" className="login-button">Aceptar</Button>
        </form>
    );
}


const passwordInputs = (showPassword: boolean, setShowPassword: (show: boolean) => void, register: any, errors: any, passwordError: string, confirmPasswordError: string) => {
    return (
        <>
            <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                className="input"
                {...register('password', { required: 'La contraseña es obligatoria' })}
                error={!!errors.password || !!(passwordError.length > 0)}
                helperText={typeof errors.password?.message === 'string' ? errors.password.message : passwordError}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} style={{ color: "#AF234A" }}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                label="Confirmar contraseña"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                className="input"
                {...register('confirmPassword', { required: 'Es necesaria la confirmación' })}
                error={!!errors.confirmPassword || !!(confirmPasswordError.length > 0)}
                helperText={typeof errors.confirmPassword?.message === 'string' ? errors.confirmPassword.message : confirmPasswordError}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} style={{ color: "#AF234A" }}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </>
    )
}


const initPage = (tokenApi: TokenApi, tokenId: string, navigate: (path: string) => void) => {
    const fetchToken = async () => {
        await tokenApi.getToken(tokenId);
        if (tokenApi.isError('INVALID_TOKEN')) {
            showInvalidTokenMessage(navigate);
        }
    }
    fetchToken();
}


const useResetPassword = (tokenId: string, navigate: (path: string) => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const authApi = new AuthUserApi();

    const resetPassword = async () => {
        const password = getValues('password');
        const confirmPassword = getValues('confirmPassword');
        const user = await authApi.resetPassword(tokenId, password);
        if (verifyErrors(password, confirmPassword, setPasswordError, setConfirmPasswordError, authApi)) return;
        if (!user) return;
        setCookie(user);
        navigate('/');
    }

    return {
        register,
        handleSubmit,
        errors,
        passwordError,
        confirmPasswordError,
        resetPassword,
    }
}

const verifyErrors = (password: string, confirmPassword: string,
    setPasswordError: (error: string) => void, setConfirmPasswordError: (error: string) => void,
    authApi: AuthUserApi
): boolean => {
    setPasswordError('');
    setConfirmPasswordError('');
    if (password !== confirmPassword) {
        setConfirmPasswordError('Las contraseñas no coinciden');
        return true;
    }
    if (authApi.isError('INVALID_PASSWORD')) {
        setPasswordError(authApi.getErrorMessage());
        return true;
    }
    return false;
}


const setCookie = (user: User) => {
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
}


const showInvalidTokenMessage = (navigate: (path: string) => void) => {
    Swal.fire({
        title: "Link inválido",
        text: `Lo sentimos pero el link que has ingresado no es válido o está caducado.`,
        icon: "error",
        confirmButtonText: "OK"
    }).then(() => {
        navigate('/');
    });
}