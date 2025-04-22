import { useParams } from "react-router-dom"
import { useRole } from "../hooks/useRole"
import { Box, Typography } from "@mui/material";
import { ActionForm } from "../components/forms/ActionForm";
import { InputTextField2 } from "../components/inputs/InputTextField";
import { MovilPermission } from "../components/inputs/PermissionsInput";
import { RolePermissionsTable } from "../components/tables/RolePermissionsTable";
import { confirmDeleteRoleMessage } from "../utils/alerts";

export const RoleInfo = () => {
    const { roleId } = useParams()
    const { nameProps, movilProps, permissionsProps, updateRole, mode, setMode, discartChanges,
        permissions, deleteRole, isSuperAdminRole
    } = useRole({ mode: 'read', roleName: roleId });

    return (
        <ActionForm width='90%' handleSubmit={updateRole} mode={mode} discartChanges={discartChanges}
            edit={() => setMode('update')} allowEdit={permissions?.edit && !isSuperAdminRole()} allowDelete={permissions?.delete}
            delete={() => confirmDeleteRoleMessage(deleteRole)}>
            <InputTextField2 labelText='Nombre del rol' width='50%' {...nameProps}
                disabled={mode === 'read'}/>
            <Box display='flex' width='100%' justifyContent='space-between' marginBottom={-2}>
                <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Permisos</Typography>
                <MovilPermission {...movilProps} disabled={mode === 'read'}/>
            </Box>
            <RolePermissionsTable permissions={permissionsProps} disabled={mode === 'read'}/>
        </ActionForm>
    )
}