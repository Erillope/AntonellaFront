import { useParams, useNavigate } from "react-router-dom"
import { useCreateRole } from "../hooks/useCreateRole"
import { useEffect } from "react"
import { UpdateRoleForm } from "../components/UpdateRoleForm"
import { confirmDeleteRoleMessage } from "../util/alerts"
import { TextInputField } from "../components/inputField/TextInputField"
import { MovilPermission } from "../components/inputField/SelectPermissions"
import { RolePermissionsTable } from "../components/RolePermissionsTable"

export const RoleInfo = () => {
    const navigate = useNavigate()
    const { roleId } = useParams()
    const { register, handleSubmit, errors, updateRole, setCitasPermissions, setUsuariosPermissions,
        setServiciosPermissions, setProductosPermissions, setRolesPermissions, setNotificacionesPermissions, setChatsPermissions, setPagosPermissions, setMovilPermissions, roleNameError, initEdit,
        roleName, setRoleName, movilPermissions, citasPermissions, chatsPermissions,
        pagosPermissions, productosPermissions, rolesPermissions, usuariosPermissions,
        serviciosPermissions, notificacionesPermissions, formRef, editable,
        deletePermission, discartChanges, deleteRole, role } = useCreateRole();

    const delRole = () => confirmDeleteRoleMessage(() => deleteRole(() => navigate('/role/search')))
    useEffect(() => initEdit(roleId ?? '', () => navigate('/'), () => navigate('/role/search')), [])

    return (
        <UpdateRoleForm handleSubmit={() => handleSubmit(updateRole)} formRef={formRef}
            deletePermission={deletePermission} editable={editable}
            discartChanges={() => discartChanges(role)} confirmDeleteRole={delRole}>
            <TextInputField register={register} errors={errors} name="roleName"
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