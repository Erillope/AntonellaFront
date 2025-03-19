import { TokenApi } from '../api/token_api';
import Swal from 'sweetalert2';

export const initResetPasswordPage = (tokenId: string, action: () => void) => {
    const tokenApi = new TokenApi();
    const fetchToken = async () => {
        await tokenApi.getToken(tokenId);
        if (tokenApi.isError('INVALID_TOKEN')) {
            showInvalidTokenMessage(action);
        }
    }
    fetchToken();
}

const showInvalidTokenMessage = (action: () => void) => {
    Swal.fire({
        title: "Link inválido",
        text: `Lo sentimos pero el link que has ingresado no es válido o está caducado.`,
        icon: "error",
        confirmButtonText: "OK"
    }).then(() => {
        action();
    });
}