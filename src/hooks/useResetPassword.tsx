import { AuthUserApi, User } from '../api/user_api';
import Cookies from 'js-cookie';
import { TokenApi } from '../api/token_api';
import { invalidTokenMessage } from '../utils/alerts';
import { useInputTextField } from '../components/inputs/InputTextField';
import { validatePassword } from '../utils/validators';

export const useResetPassword = (tokenId: string, action: () => void) => {
    const passwordController = useInputTextField();
    const confirmPasswordController = useInputTextField();
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
        if (validate(passwordController.value, confirmPasswordController.value)) return;
        const user = await authApi.resetPassword(tokenId, passwordController.value);
        if (verifyErrors()) return;
        if (!user) return;
        setCookie(user);
        action();
    }

    const verifyErrors = (): boolean => {
        if (authApi.isError('INVALID_PASSWORD')) {
            passwordController.setError(authApi.getErrorMessage());
            return true;
        }
        return false;
    }

    const setCookie = (user: User) => {
        Cookies.set('user', JSON.stringify(user), { expires: 1 });
    }

    const validate = (password: string, confirmPassword: string): boolean => {
        passwordController.clearError();
        confirmPasswordController.clearError();
        if (passwordController.isEmpty()) {
            passwordController.setError('La contraseña es requerida');
            return true;
        }
        if (confirmPasswordController.isEmpty()) {
            confirmPasswordController.setError('Es necesaria la confirmación');
            return true;
        }
        if (password !== confirmPassword) {
            confirmPasswordController.setError('Las contraseñas no coinciden');
            return true;
        }
        if (!validatePassword(password)) {
            passwordController.setError('La contraseña no es válida');
            return true;
        }
        return false;
    }

    return {
        resetPassword,
        init,
        passwordProps: passwordController.getProps(),
        confirmPasswordProps: confirmPasswordController.getProps(),
    }
}