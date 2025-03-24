import { useParams } from "react-router-dom"
import { useRole } from "../hooks/useRole"
import { useEffect } from "react"
import { UpdateRoleForm } from "../components/UpdateRoleForm"
import { TextInputField } from "../components/inputField/TextInputField"
import { MovilPermission } from "../components/inputField/SelectPermissions"
import { RolePermissionsTable } from "../components/RolePermissionsTable"
import { useRoleFormActions } from "../hooks/useRoleFormActions"

export const RoleInfo = () => {
    const { roleId } = useParams()
    const { register, handleSubmit, errors, updateRole, setCitasPermissions, setUsuariosPermissions,
        setServiciosPermissions, setProductosPermissions, setRolesPermissions, setNotificacionesPermissions, setChatsPermissions, setPagosPermissions, setMovilPermissions, roleNameError, initEdit,
        roleName, setRoleName, movilPermissions, citasPermissions, chatsPermissions,
        pagosPermissions, productosPermissions, rolesPermissions, usuariosPermissions,
        serviciosPermissions, notificacionesPermissions, formRef, editable,
        deletePermission, discartChanges, deleteRole, role } = useRole();

    const { notHaveReadpermissionAction, notFoundRoleAction, handleUpdateRole,
        handleDeleteRole } = useRoleFormActions({ updateRole, deleteRole})

    useEffect(() => initEdit(roleId ?? '', notHaveReadpermissionAction, notFoundRoleAction), [])

    return (
        <UpdateRoleForm handleSubmit={() => handleSubmit(handleUpdateRole)} formRef={formRef}
            deletePermission={deletePermission} editable={editable}
            discartChanges={() => discartChanges(role)} confirmDeleteRole={handleDeleteRole}>
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
        </UpdateRoleForm>
    )
}