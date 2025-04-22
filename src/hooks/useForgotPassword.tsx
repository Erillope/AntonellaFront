import { AuthUserApi } from '../api/user_api';
import Swal from 'sweetalert2';
import { emailInstruccionMessage, sendingEmailMessage } from '../utils/alerts';
import { useInputTextField } from '../components/inputs/InputTextField';


export const useForgotPassword = (action: () => void) => {
    const emailController = useInputTextField()
    const authApi = new AuthUserApi();

    const sendResetPasswordLink = async () => {
        if (validate()) return;
        sendingEmailMessage();
        await authApi.forgotPassword(emailController.value);
        if (verifyErrors()) return;
        emailInstruccionMessage(emailController.value);
        action();
    }

    const verifyErrors = (): boolean => {
        emailController.clearError();
        if (authApi.isError('EMAIL_NOT_REGISTERED')) {
            emailController.setError(authApi.getErrorMessage())
            Swal.close();
            return true;
        }
        return false;
    }

    const validate = (): boolean => {
        emailController.clearError()
        if (emailController.isEmpty()) {
            emailController.setError('El email es requerido')
            return true;
        }
        return false
    }

    return {
        emailProps: emailController.getProps(),
        sendResetPasswordLink
    }
}