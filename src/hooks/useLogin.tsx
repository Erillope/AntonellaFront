import Cookies from "js-cookie";
import { AuthUserApi, User } from '../api/user_api'
import { useInputTextField } from "../components/inputs/InputTextField";
import { verifyUserMessage, closeAlert } from "../utils/alerts";

interface useLoginProps {
    afterLogin: () => void;
}

export const useLogin = (props: useLoginProps) => {
    const phoneNumberController = useInputTextField();
    const passwordController = useInputTextField();
    const authApi = new AuthUserApi();

    const setCookie = (user: User) => {
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
    }

    const signIn = async () => {
        if (validate()) return;
        verifyUserMessage()
        const user = await authApi.signIn(phoneNumberController.value, passwordController.value);
        closeAlert();
        if (!user) {verifyErrors(); return}
        setCookie(user);
        props.afterLogin();
    }

    const validate = (): boolean => {
        clearErrors();
        if (phoneNumberController.isEmpty()) {
            phoneNumberController.setError("El número de teléfono es requerido.");
            return true;
        }
        if (passwordController.isEmpty()) {
            passwordController.setError("La contraseña es requerida.");
            return true;
        }
        return false;
    }

    const verifyErrors = (): boolean => {    
        if (authApi.isError("PHONE_NUMBER_NOT_REGISTERED")) {
            phoneNumberController.setError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError("ICORRECT_PASSWORD")) {
            passwordController.setError(authApi.getErrorMessage());
            return true;
        }
        return false;
    };

    const clearErrors = () => {
        phoneNumberController.clearError();
        passwordController.clearError();
    }

    return {
        signIn,
        phoneNumberProps: phoneNumberController.getProps(),
        passwordProps: passwordController.getProps(),
    };
}