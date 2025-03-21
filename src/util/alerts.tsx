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

export const permissionsNotSelectedMessage = () => {
    Swal.fire({
        title: 'Permisos no seleccionados',
        text: 'Debe seleccionar al menos un permiso',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}

export const successRoleCreatedMessage = (action: () => void) => {
    Swal.fire({
        title: 'Rol creado',
        text: 'El rol se ha creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(action);
}

export const successRoleUpdatedMessage = () => {
    Swal.fire({
        title: 'Rol actualizado',
        text: 'El rol se ha sido actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}

export const roleDeletedMessage = (roleName: string) => {
    Swal.fire({
        title: 'Rol eliminado',
        text: `El rol ${roleName} ha sido eliminado correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    })
}

export const confirmDeleteRoleMessage = (action: () => void) => {
    Swal.fire({
        title: 'Eliminar Rol',
        text: '¿Está seguro que desea eliminar el rol? También se removerá de la lista de roles de los usuarios',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            action();
    }})
}