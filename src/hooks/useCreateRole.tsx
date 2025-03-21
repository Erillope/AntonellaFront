import { useRef, useState } from "react";
import { PermissionVerifier } from "../api/verifyPermissions";
import { AccessPermission, CreateRole, RoleApi, Role } from "../api/role_api";
import { useForm } from "react-hook-form";
import {
    permissionsNotSelectedMessage, successRoleCreatedMessage,
    successRoleUpdatedMessage, roleDeletedMessage
} from "../util/alerts";

export const useCreateRole = () => {
    const roleApi = new RoleApi();
    const formRef = useRef<HTMLFormElement>(null);
    const permissionVerifier = new PermissionVerifier();
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
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
    const [roleNameError, setRoleNameError] = useState('');
    const [role, setRole] = useState<Role>();
    const [editable, setEditable] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);

    const initCreate = (notHaveCreatePermission: () => void) => {
        const verifyPermissions = async () => {
            const permissions = await permissionVerifier.getRoleAccessPermissions();
            if (!permissions.create) {
                notHaveCreatePermission(); return
            }
        }
        verifyPermissions();
    }

    const initEdit = (roleId: string, notHaveReadpermission: () => void, notFound: () => void) => {
        const verifyPermissions = async () => {
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
        verifyPermissions();
    }

    const createRole = async () => {
        const request = getRoleData();
        if (request.accesses.length === 0) {
            permissionsNotSelectedMessage();
            return;
        }
        await roleApi.createRole(request);
        if (verifyErros()) { return }
        successRoleCreatedMessage(clearForm);
    }

    const updateRole = async () => {
        const request = getRoleData();
        if (request.accesses.length === 0) {
            permissionsNotSelectedMessage();
            return;
        }
        const updatedRole = await roleApi.updateRole({ role: role?.name ?? '', name: request.name, accesses: request.accesses });
        if (verifyErros()) { return }
        setRole(updatedRole);
        successRoleUpdatedMessage();
    }

    const deleteRole = (action: () => void) => {
        roleApi.deleteRole(role?.name ?? '');
        roleDeletedMessage(role?.name ?? '');
        action();
    }

    const getRoleData = (): CreateRole => {
        return {
            name: getValues("roleName"),
            accesses: getAccessesData().filter(access => access.permissions.length > 0)
        }
    }

    const verifyErros = (): boolean => {
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
        setRoleName(role?.name??'');
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
        role
    }

}