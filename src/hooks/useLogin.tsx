import Cookies from "js-cookie";
import { AuthUserApi, User } from '../api/user_api'
import { useForm } from 'react-hook-form';
import { useState } from "react";

export const useLogin = (action: () => void) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const authApi = new AuthUserApi();

    const setCookie = (user: User) => {
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
    }

    const signIn = async () => {
        const phoneNumber = getValues('phoneNumber');
        const password = getValues('password');
        const user = await authApi.signIn(phoneNumber, password);
        if (verifyErrors()) return;
        if (!user) return;
        setCookie(user);
        action();
    }

    const verifyErrors = (): boolean => {
    
        setPhoneNumberError("");
        setPasswordError("");
    
        if (authApi.isError("PHONE_NUMBER_NOT_REGISTERED")) {
            setPhoneNumberError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError("ICORRECT_PASSWORD")) {
            setPasswordError(authApi.getErrorMessage());
            return true;
        }
        return false;
    };

    return {
        register,
        handleSubmit,
        errors,
        phoneNumberError,
        passwordError,
        signIn,
    };
}