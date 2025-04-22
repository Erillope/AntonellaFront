import { useEffect, useState } from "react";
import { AccessPermission, CreateRole, Role, RoleApi } from "../api/role_api";
import { useInputTextField } from "../components/inputs/InputTextField";
import { useMovilPermissions, usePermissions } from "../components/inputs/PermissionsInput";
import { PermissionVerifier } from "../api/verifyPermissions";
import { useNavigate } from "react-router-dom";
import { permissionsNotSelectedMessage, successRoleCreatedMessage, successRoleUpdatedMessage,
    loadingMessage, closeAlert, roleDeletedMessage
 } from "../utils/alerts";
import { validateRoleName } from "../utils/validators";
import { Permissions } from "../api/verifyPermissions";

interface UseRoleProps {
    mode?: "create" | "read" | "update",
    roleName?: string,
}

export const useRole = (props?: UseRoleProps) => {
    const navigate = useNavigate();
    const nameController = useInputTextField()
    const movilController = useMovilPermissions()
    const permissionsController = usePermissions()
    const permissionVerifier = new PermissionVerifier();
    const roleApi = new RoleApi();
    const [mode, setMode] = useState<"create" | "read" | "update">(props?.mode ?? 'create');
    const [role, setRole] = useState<Role>();
    const [permissions, setPermissions] = useState<Permissions>();

    useEffect(() => {
        const init = async () => {
            const permissions = await permissionVerifier.getUserAccessPermissions();
            setPermissions(permissions);
            if (!permissions?.create && mode === 'create') { navigate('/') }
            if (!permissions?.read && mode === 'read') { navigate('/') }
            if (permissions.read && mode === 'read') { await initRole() }
        }
        init()
    }, [])

    const createRole = async () => {
        const request = getRoleData();
        if (!validate(request.accesses)) { return }
        loadingMessage('Creando rol...')
        const role = await roleApi.createRole(request);
        if (!role) {
            verifyAlreadyExistRole();
            return;
        }
        successRoleCreatedMessage(clearInputs);
    }

    const updateRole = async () => {
        const request = getRoleData();
        if (!validate(request.accesses)) { return }
        loadingMessage('Actualizando rol...')
        const updatedRole = await roleApi.updateRole({ role: role?.name ?? '', name: request.name, accesses: request.accesses });
        if (!updatedRole) {
            verifyAlreadyExistRole();
            return;
        }
        setRole(updatedRole);
        successRoleUpdatedMessage();
    }

    const deleteRole = async() => {
        await roleApi.deleteRole(role?.name ?? '');
        navigate('/role/search/');
        roleDeletedMessage(role?.name ?? '');
    }

    const initRole = async () => {
        const role = await roleApi.getRole(props?.roleName ?? '');
        setRole(role);
        if (!role) { return; }
        initData(role);
    }

    const initData = (role: Role) => {
        nameController.setValue(role.name);
        movilController.setPermissions(role.accesses.filter(access => access.access === 'MOVIL')[0]?.permissions ?? []);
        permissionsController.setFromAccessPermissions(role.accesses.filter(access => access.access !== 'MOVIL'));
    }

    const getRoleData = (): CreateRole => {
        const movilPermissions = movilController.permissions.length > 0 ? {
            access: 'MOVIL',
            permissions: movilController.permissions
        } : undefined
        const accesses = movilPermissions ? [movilPermissions, ...permissionsController.getData()] : permissionsController.getData()
        return {
            name: nameController.value,
            accesses: accesses
        }
    }

    const validate = (accesses: AccessPermission[]): boolean => {
        clearErrors()
        let isValid = true
        if (!validateRoleName(nameController.value)) {
            nameController.setError('El nombre del rol no es valido')
            isValid = false
        }
        if (accesses.length === 0) {
            permissionsNotSelectedMessage();
            isValid = false
        }
        return isValid
    }

    const verifyAlreadyExistRole = () => {
        if (roleApi.isError('ROLE_ALREADY_EXISTS')) {
            nameController.setError(roleApi.getErrorMessage())
            closeAlert()
        }
    }

    const clearInputs = () => {
        nameController.clearInput()
        movilController.clearInput()
        permissionsController.clearInputs()
    }

    const clearErrors = () => {
        nameController.clearError()
        movilController.clearError()
    }

    const isSuperAdminRole = () => {
        return role?.name === 'super_admin'
    }

    return {
        createRole,
        updateRole,
        deleteRole,
        movilProps: movilController.getProps(),
        permissionsProps: permissionsController.getProps(),
        nameProps: nameController.getProps(),
        mode,
        setMode,
        discartChanges: () => initData(role ?? {} as Role),
        permissions,
        isSuperAdminRole
    }

}