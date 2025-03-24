import { useForm } from "react-hook-form";
import { AccessPermission, CreateRole, Role, RoleApi } from "../api/role_api";
import { PermissionVerifier } from "../api/verifyPermissions";
import { useRef, useState } from "react";

export const useRoleForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const permissionVerifier = new PermissionVerifier();
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [roleNameError, setRoleNameError] = useState('');
    const roleApi = new RoleApi();
    const [citasPermissions, setCitasPermissions] = useState<string[]>([]);
    const [usuariosPermissions, setUsuariosPermissions] = useState<string[]>([]);
    const [serviciosPermissions, setServiciosPermissions] = useState<string[]>([]);
    const [productosPermissions, setProductosPermissions] = useState<string[]>([]);
    const [rolesPermissions, setRolesPermissions] = useState<string[]>([]);
    const [notificacionesPermissions, setNotificacionesPermissions] = useState<string[]>([]);
    const [chatsPermissions, setChatsPermissions] = useState<string[]>([]);
    const [pagosPermissions, setPagosPermissions] = useState<string[]>([]);
    const [movilPermissions, setMovilPermissions] = useState<string[]>([]);
    const [roleName, setRoleName] = useState('');
    const [role, setRole] = useState<Role>();
    const [editable, setEditable] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);

    const getRoleData = (): CreateRole => {
        return {
            name: getValues("roleName"),
            accesses: getAccessesData().filter(access => access.permissions.length > 0)
        }
    }

    const verifyCreateRolePermissions = async (notHaveCreatePermission: () => void) => {
        const permissions = await permissionVerifier.getRoleAccessPermissions();
        if (!permissions.create) {
            notHaveCreatePermission(); return
        }
    }

    const verifyReadAndEditRolePermissions = async (roleId: string, notFound: () => void, 
    notHaveReadpermission: () => void) => {
        const permissions = await permissionVerifier.getRoleAccessPermissions();
        const selectedRole = await roleApi.getRole(roleId);
        if (roleApi.isError('ROLE_NOT_FOUND')) {
            notFound(); return
        }
        if (!permissions.read) {
            notHaveReadpermission(); return
        }
        if (!!(selectedRole?.name === "super_admin")) {
            setEditable(false);
            setDeletePermission(false);
        }
        else {
            setEditable(permissions.edit)
            setDeletePermission(permissions.delete)
        }
        if (selectedRole) {
            setRole(selectedRole);
            discartChanges(selectedRole);
        }
    }

    const verifyErrors = (): boolean => {
        setRoleNameError('');
        if (roleApi.isError('INVALID_ROLE_NAME')) {
            setRoleNameError(roleApi.getErrorMessage());
            return true;
        }
        if (roleApi.isError('ROLE_ALREADY_EXISTS')) {
            setRoleNameError(roleApi.getErrorMessage());
            return true;
        }
        return false;
    }

    const clearForm = () => {
        setCitasPermissions([]);
        setUsuariosPermissions([]);
        setServiciosPermissions([]);
        setProductosPermissions([]);
        setRolesPermissions([]);
        setNotificacionesPermissions([]);
        setChatsPermissions([]);
        setPagosPermissions([]);
        setMovilPermissions([]);
        setRoleName('');
        setValue("roleName", '');
    }

    const discartChanges = (role: Role | undefined) => {
        setRole(role);
        setRoleName(role?.name ?? '');
        setValue("roleName", role?.name);
        setMovilPermissions([]);
        role?.accesses.forEach(access => {
            if (access.access === "CITAS") { setCitasPermissions(access.permissions) }
            if (access.access === "USUARIOS") { setUsuariosPermissions(access.permissions) }
            if (access.access === "SERVICIOS") { setServiciosPermissions(access.permissions) }
            if (access.access === "PRODUCTOS") { setProductosPermissions(access.permissions) }
            if (access.access === "ROLES") { setRolesPermissions(access.permissions) }
            if (access.access === "NOTIFICACIONES") { setNotificacionesPermissions(access.permissions) }
            if (access.access === "CHATS") { setChatsPermissions(access.permissions) }
            if (access.access === "PAGOS") { setPagosPermissions(access.permissions) }
            if (access.access === "MOVIL") { setMovilPermissions(access.permissions) }
        })
    }

    const getAccessesData = (): AccessPermission[] => {
        return [
            {
                access: "CITAS",
                permissions: citasPermissions
            },
            {
                access: "USUARIOS",
                permissions: usuariosPermissions
            },
            {
                access: "SERVICIOS",
                permissions: serviciosPermissions
            },
            {
                access: "PRODUCTOS",
                permissions: productosPermissions
            },
            {
                access: "ROLES",
                permissions: rolesPermissions
            },
            {
                access: "NOTIFICACIONES",
                permissions: notificacionesPermissions
            },
            {
                access: "CHATS",
                permissions: chatsPermissions
            },
            {
                access: "PAGOS",
                permissions: pagosPermissions
            },
            {
                access: "MOVIL",
                permissions: movilPermissions
            }
        ]
    }

    return {
        verifyCreateRolePermissions,
        verifyReadAndEditRolePermissions,
        getRoleData,
        roleApi,
        verifyErrors,
        clearForm,
        role,
        setRole,
        editable,
        formRef,
        register,
        handleSubmit,
        errors,
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
        movilPermissions,
        setMovilPermissions,
        roleNameError,
        roleName,
        setRoleName,
        discartChanges,
        deletePermission,
        setDeletePermission
    }
}