import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthUserApi } from '../api/user_api';
import Swal from 'sweetalert2';


export const useForgotPassword = (action: () => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [emailError, setEmailError] = useState('');
    const authApi = new AuthUserApi();

    const sendResetPasswordLink = async () => {
        const email = getValues('email');
        loading();
        await authApi.forgotPassword(email);
        if (verifyErrors()) return;
        showInstructions(email);
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


const showInstructions = (email: string) => {
    Swal.fire({
        title: "Instrucciones Enviadas",
        text: `Hemos enviado instrucciones para cambiar tu contraseña a ${email}. Por favor revise su bandeja de entrada y la carpeta de spam.`,
        icon: "success",
        confirmButtonText: "OK"
    });
}