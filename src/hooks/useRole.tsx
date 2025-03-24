import { Role } from "../api/role_api";
import { useRoleForm } from "./useRoleForm";

export interface CreateRoleActions {
    successRoleCreatedAction: () => void;
    permissionsNotSelectedAction: () => void
}

export interface UpdateRoleActions {
    successRoleUpdatedAction: () => void;
    permissionsNotSelectedAction: () => void
}

export const useRole = () => {
    const {verifyCreateRolePermissions, verifyReadAndEditRolePermissions, getRoleData, roleApi, verifyErrors,
        clearForm, role, setRole, editable, formRef, register, handleSubmit, errors, citasPermissions,
        setCitasPermissions, usuariosPermissions, setUsuariosPermissions, serviciosPermissions,
        setServiciosPermissions, productosPermissions, setProductosPermissions, rolesPermissions,
        setRolesPermissions, notificacionesPermissions, setNotificacionesPermissions, chatsPermissions,
        setChatsPermissions, pagosPermissions, setPagosPermissions, setMovilPermissions, movilPermissions,
        roleNameError, roleName, setRoleName, deletePermission, discartChanges
    } = useRoleForm();

    const initCreate = (notHaveCreatePermission: () => void) => {
        verifyCreateRolePermissions(notHaveCreatePermission);
    }

    const initEdit = (roleId: string, notHaveReadpermission: () => void, notFound: () => void) => {
        verifyReadAndEditRolePermissions(roleId, notFound, notHaveReadpermission);
    }

    const createRole = async ({ successRoleCreatedAction, permissionsNotSelectedAction }: CreateRoleActions) => {
        const request = getRoleData();
        if (request.accesses.length === 0) {
            permissionsNotSelectedAction();
            return;
        }
        await roleApi.createRole(request);
        if (verifyErrors()) { return }
        successRoleCreatedAction();
    }

    const updateRole = async ({successRoleUpdatedAction, permissionsNotSelectedAction}: UpdateRoleActions) => {
        const request = getRoleData();
        if (request.accesses.length === 0) {
            permissionsNotSelectedAction();
            return;
        }
        const updatedRole = await roleApi.updateRole({ role: role?.name ?? '', name: request.name, accesses: request.accesses });
        if (verifyErrors()) { return }
        setRole(updatedRole);
        successRoleUpdatedAction();
    }

    const deleteRole = async(roleDeletedAction: (role: Role) => void) => {
        await roleApi.deleteRole(role?.name ?? '');
        role && roleDeletedAction(role);
    }

    return {
        register,
        handleSubmit,
        errors,
        createRole,
        initCreate,
        citasPermissions,
        setCitasPermissions,
        usuariosPermissions,
        setUsuariosPermissions,
        serviciosPermissions,
        setServiciosPermissions,
        productosPermissions,
        setProductosPermissions,
        rolesPermissions,
        setRolesPermissions,
        notificacionesPermissions,
        setNotificacionesPermissions,
        chatsPermissions,
        setChatsPermissions,
        pagosPermissions,
        setPagosPermissions,
        setMovilPermissions,
        movilPermissions,
        roleNameError,
        roleName,
        setRoleName,
        formRef,
        updateRole,
        initEdit,
        editable,
        deletePermission,
        discartChanges,
        deleteRole,
        role,
        clearForm
    }

}