import { useEffect } from 'react';
import { TextInputField } from '../components/inputField/TextInputField';
import { useRole } from '../hooks/useRole';
import { MovilPermission } from '../components/inputField/SelectPermissions';
import { RolePermissionsTable } from '../components/RolePermissionsTable';
import { CreateRoleForm } from '../components/CreateRoleForm';
import { useRoleFormActions } from '../hooks/useRoleFormActions';

export const CreateRole = () => {
    const { register, handleSubmit, errors, createRole, setCitasPermissions, setUsuariosPermissions,
        setServiciosPermissions, setProductosPermissions, setRolesPermissions, setNotificacionesPermissions, setChatsPermissions, setPagosPermissions, setMovilPermissions, roleNameError, initCreate,
        roleName, setRoleName, movilPermissions, citasPermissions, chatsPermissions,
        pagosPermissions, productosPermissions, rolesPermissions, usuariosPermissions,
        serviciosPermissions, notificacionesPermissions, formRef, clearForm} = useRole();
    
    const { handleCreateRole, notHaveCreatePermissionAction } = useRoleFormActions({clearForm, createRole})

    useEffect(() => initCreate(notHaveCreatePermissionAction), [])

    return (
        <CreateRoleForm handleSubmit={() => handleSubmit(handleCreateRole)} formRef={formRef}>
            <TextInputField register={register} errors={errors} name="roleName" style={{ width: "50%" }}
                inputError={roleNameError} value={roleName} onValueChange={setRoleName}
                labelText="Nombre del rol" requiredErrorText="El nombre del rol es requerido" />
            <MovilPermission onSelectMovilPermissions={setMovilPermissions} value={movilPermissions} />
            <RolePermissionsTable
                onSelectCitasPermissions={setCitasPermissions}
                onSelectUsuariosPermissions={setUsuariosPermissions}
                onSelectServiciosPermissions={setServiciosPermissions}
                onSelectProductosPermissions={setProductosPermissions}
                onSelectRolesPermissions={setRolesPermissions}
                onSelectNotificacionesPermissions={setNotificacionesPermissions}
                onSelectChatsPermissions={setChatsPermissions}
                onSelectPagosPermissions={setPagosPermissions}
                citasPermissions={citasPermissions} usuariosPermissions={usuariosPermissions}
                serviciosPermissions={serviciosPermissions} productosPermissions={productosPermissions}
                rolesPermissions={rolesPermissions} notificacionesPermissions={notificacionesPermissions}
                chatsPermissions={chatsPermissions} pagosPermissions={pagosPermissions}
            />
        </CreateRoleForm>
    )
}