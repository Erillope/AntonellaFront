import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthUserApi } from '../api/user_api';
import Swal from 'sweetalert2';
import { emailInstruccionMessage, sendingEmailMessage } from '../utils/alerts';


export const useForgotPassword = (action: () => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [emailError, setEmailError] = useState('');
    const authApi = new AuthUserApi();

    const sendResetPasswordLink = async () => {
        const email = getValues('email');
        sendingEmailMessage();
        await authApi.forgotPassword(email);
        if (verifyErrors()) return;
        emailInstruccionMessage(email);
        action();
    }

    const verifyErrors = (): boolean => {
        setEmailError('');
        if (authApi.isError('EMAIL_NOT_REGISTERED')) {
            setEmailError(authApi.getErrorMessage());
            Swal.close();
            return true;
        }
        return false;
    }

    return {
        register,
        handleSubmit,
        errors,
        emailError,
        sendResetPasswordLink
    }
}