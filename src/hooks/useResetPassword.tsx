import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthUserApi, User } from '../api/user_api';
import Cookies from 'js-cookie';
import { TokenApi } from '../api/token_api';
import { invalidTokenMessage } from '../utils/alerts';

export const useResetPassword = (tokenId: string, action: () => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const authApi = new AuthUserApi();
    const tokenApi = new TokenApi();

    const init = () => {
        const fetchToken = async () => {
            await tokenApi.getToken(tokenId);
            if (tokenApi.isError('INVALID_TOKEN')) {
                invalidTokenMessage(action);
            }
        }
        fetchToken();
    }

    const resetPassword = async () => {
        const password = getValues('password');
        const confirmPassword = getValues('confirmPassword');
        const user = await authApi.resetPassword(tokenId, password);
        if (verifyErrors(password, confirmPassword)) return;
        if (!user) return;
        setCookie(user);
        action();
    }

    const verifyErrors = (password: string, confirmPassword: string): boolean => {
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

    return {
        register,
        handleSubmit,
        errors,
        passwordError,
        confirmPasswordError,
        resetPassword,
        init
    }
}