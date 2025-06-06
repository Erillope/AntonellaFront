import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../styles/swal.css";
import okIcon from "../assets/ok.png";
import errorIcon from "../assets/error.png";
import warningIcon from "../assets/warning.png";
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

type alertType = 'ok' | 'error' | 'warning' | 'loading';

const AlertMessage = ({ message, title, type }: { message: string, title: string, type: alertType }) => {
    const icon = type == 'ok' ? okIcon : type == 'error' ? errorIcon : type == 'warning' ? warningIcon : '';
    return (
        <Box textAlign='center' paddingTop={2}>
            {type == 'loading' ? <CircularProgress style={{color: '#F44565'}}/> :
            <img src={icon} className='swal-icon' />}
            <h3 style={{ marginTop: '10px', fontSize: '25px', color: 'black' }}>{title}</h3>
            <h3 style={{ fontSize: '15px' }}>{message}</h3>
        </Box>
    )
}

const MySwal = withReactContent(Swal);

export const closeAlert = () => MySwal.close();

interface AlertProps {
    message?: string;
    title: string;
    type: alertType;
    action?: (result: SweetAlertResult<any>) => void;
    confirmButtonText?: string;
    cancelButtonText?: string
}

const showAlert = (props: AlertProps) => {
    MySwal.fire({
        html: <AlertMessage message={props.message??''} title={props.title} type={props.type}/>,
        allowOutsideClick: props.type !== 'loading',
        showConfirmButton: props.type !== 'loading',
        showCancelButton: props.type === 'warning',
        confirmButtonText: props.confirmButtonText || "OK",
        cancelButtonText: props.cancelButtonText,
        customClass: {
            popup: "swal-custom",
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-confirm-button",
        }
    }).then((result) => props.action?.(result))
}

const confirmDeleteAlert = (title: string, message: string, action: () => void) => {
    showAlert({title, message, type: 'warning', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar',
        action: (result) => {
            if (result.isConfirmed) {
                action();
            }
        }
    })
}

export const emailInstruccionMessage = (email: string) => {
    const title = "Instrucciones Enviadas";
    const message = `Hemos enviado instrucciones para cambiar tu contraseña a ${email}. Por favor revise su bandeja de entrada y la carpeta de spam.`;
    showAlert({message, title, type: 'ok'});
}

export const verifyUserMessage = () => {
    const title = "Verificando usuario...";
    const message = "Esto puede tardar unos segundos";
    showAlert({message, title, type: 'loading'});
}

export const sendingEmailMessage = () => {
    const title = "Enviando correo de verificación...";
    const message = "Esto puede tardar unos segundos";
    showAlert({message, title, type: 'loading'});
}

export const loadingMessage = (title: string) => {
    const message = "Esto puede tardar unos segundos";
    showAlert({message, title, type: 'loading'});
}

export const confirmLogOutMessage = (action: () => void) => {
    const title = "¿Estás seguro que deseas cerrar sesión?";
    showAlert({ message: '', title, type: 'warning', confirmButtonText: 'Sí', cancelButtonText: 'No',
        action: (result) => {
            if (result.isConfirmed) {
                action();
            }
        }
    });
}

export const alreadyExistsUserMessage = (email: string, phoneNumber: string, dni: string | undefined) => {
    let message = `El usuario con email ${email} o número de celular ${phoneNumber} ya se encuentra registrado en el sistema.`;
    if (dni) {
        message = `El usuario con email ${email}, número de celular ${phoneNumber} o cedula ${dni} ya se encuentra registrado en el sistema.`;
    }
    const title = "Usuario ya registrado";
    showAlert({message, title, type: 'error'});
}

export const successUserCreationMessage = (action: () => void) => {
    const title = "Usuario creado";
    const message = "El usuario ha sido creado exitosamente.";
    showAlert({message, title, type: 'ok', action});
}

export const successUserUpdatedMessage = () => {
    const title = "Usuario actualizado";
    const message = "El usuario ha sido actualizado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const selectRoleMessage = () => {
    Swal.fire({
        title: "Roles no seleccionados",
        text: `Por favor seleccione al menos un rol para el usuario.`,
        icon: "error",
        confirmButtonText: "OK"
    })
}

export const invalidTokenMessage = (action: () => void) => {
    const message = "Lo sentimos pero el link que has ingresado no es válido o está caducado.";
    const title = "Link inválido";
    showAlert({message, title, type: 'error', action});
}

export const permissionsNotSelectedMessage = () => {
    const title = "Permisos no seleccionados";
    const message = "Por favor seleccione al menos un permiso para el rol.";
    showAlert({message, title, type: 'error'});
}

export const successRoleCreatedMessage = (action: () => void) => {
    const title = "Rol creado";
    const message = "El rol ha sido creado exitosamente.";
    showAlert({message, title, type: 'ok', action});
}

export const successRoleUpdatedMessage = () => {
    const title = "Rol actualizado";
    const message = "El rol ha sido actualizado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const roleDeletedMessage = (roleName: string) => {
    const title = "Rol eliminado";
    const message = `El rol ${roleName} ha sido eliminado exitosamente.`;
    showAlert({message, title, type: 'ok'});
}

export const confirmDeleteRoleMessage = (action: () => void) => {
    const title = "Eliminar Rol";
    const message = "¿Está seguro que desea eliminar el rol?";
    confirmDeleteAlert(title, message, action);
}

export const notSelectedImageMessage = () => {
    Swal.fire({
        title: 'Imagen no seleccionada',
        text: 'Por favor seleccione una imagen',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

export const invalidQuestionMessage = () => {
    Swal.fire({
        title: 'Pregunta inválida',
        text: 'Por favor llene los campos necesarios',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: "swal-custom",
        },
    })
}

export const successProductUpdatedMessage = () => {
    const title = "Producto actualizado";
    const message = "El producto ha sido actualizado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const productDeletedMessage = (productName: string) => {
    const title = "Producto eliminado";
    const message = `El producto ${productName} ha sido eliminado exitosamente.`;
    showAlert({message, title, type: 'ok'});
}


export const successCreatedProductMessage = (action: () => void) => {
    const title = "Producto creado";
    const message = "El producto ha sido creado exitosamente.";
    showAlert({message, title, type: 'ok', action});
}


export const confirmDeleteProductMessage = (action: () => void) => {
    const title = "Eliminar Producto";
    const message = "¿Está seguro que desea eliminar el producto?";
    confirmDeleteAlert(title, message, action);
}

export const confirmDeleteQuestionMessage = (action: () => void) => {
    const title = "Eliminar Pregunta";
    const message = "¿Está seguro que desea eliminar la pregunta?";
    confirmDeleteAlert(title, message, action);
}

export const successServiceCreatedMessage = () => {
    const title = "Servicio creado";
    const message = "El servicio ha sido creado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const confirmDeleteServiceMessage = (action: () => void) => {
    const title = "Eliminar Servicio";
    const message = "¿Está seguro que desea eliminar el servicio?";
    confirmDeleteAlert(title, message, action);
}


export const successServiceUpdatedMessage = () => {
    const title = "Servicio actualizado";
    const message = "El servicio ha sido actualizado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const successFormUpdatedMessage = () => {
    const title = "Formulario actualizado";
    const message = "El formulario ha sido actualizado exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const questionsNotCreatedMessage = () => {
    const title = "Preguntas no creadas";
    const message = "Por favor cree al menos una pregunta para el servicio.";
    showAlert({message, title, type: 'error'});
}

export const successItemAddedMessage = () => {
    const title = "Item añadido";
    const message = "El item ha sido añadido exitosamente.";
    showAlert({message, title, type: 'ok'});
}

export const confirmDeleteItemMessage = (action: () => void) => {
    const title = "Eliminar Item";
    const message = "¿Está seguro que desea eliminar este item?";
    confirmDeleteAlert(title, message, action);
}