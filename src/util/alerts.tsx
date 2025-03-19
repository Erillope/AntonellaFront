import Swal from 'sweetalert2';

export const alreadyExistsUserMessage = (email: string, phoneNumber: string, dni: string | undefined) => {
    let message = `El usuario con email ${email} o número de celular ${phoneNumber} ya se encuentra registrado en el sistema.`;
    if (dni) {
        message = `El usuario con email ${email}, número de celular ${phoneNumber} o cedula ${dni} ya se encuentra registrado en el sistema.`;
    }
    Swal.fire({
        title: "Usuario ya registrado",
        text: message,
        icon: "error",
        confirmButtonText: "OK"
    })
}

export const successUserCreationMessage = (action: () => void) => {
    Swal.fire({
        title: "Usuario creado",
        text: `El usuario ha sido creado exitosamente.`,
        icon: "success",
        confirmButtonText: "OK"
    }).then(() => {
        action();
    });
}

export const successUserUpdatedMessage = () => {
    Swal.fire({
        title: "Usuario actualizado",
        text: `El usuario ha sido actualizado exitosamente.`,
        icon: "success",
        confirmButtonText: "OK"
    });
}

export const selectRoleMessage = () => {
    Swal.fire({
        title: "Roles no seleccionados",
        text: `Por favor seleccione al menos un rol para el usuario.`,
        icon: "error",
        confirmButtonText: "OK"
    })
}

export const selectProfilePhotoMessage = () => {
    Swal.fire({
        title: "Foto no seleccionada",
        text: `Por favor seleccione una foto de perfil para el usuario.`,
        icon: "error",
        confirmButtonText: "OK"
    })
}

export const emailInstruccionMessage = (email: string) => {
    Swal.fire({
        title: "Instrucciones Enviadas",
        text: `Hemos enviado instrucciones para cambiar tu contraseña a ${email}. Por favor revise su bandeja de entrada y la carpeta de spam.`,
        icon: "success",
        confirmButtonText: "OK"
    });
}

export const sendingEmailMessage = () => {
    Swal.fire({
        title: "Enviando correo de verificación...",
        text: "Esto puede tardar unos segundos",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

export const invalidTokenMessage = (action: () => void) => {
    Swal.fire({
        title: "Link inválido",
        text: `Lo sentimos pero el link que has ingresado no es válido o está caducado.`,
        icon: "error",
        confirmButtonText: "OK"
    }).then(() => {
        action();
    });
}