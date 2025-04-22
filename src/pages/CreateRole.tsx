import { useRole } from '../hooks/useRole';
import { MovilPermission } from '../components/inputs/PermissionsInput';
import { RolePermissionsTable } from '../components/tables/RolePermissionsTable';
import { ActionForm } from '../components/forms/ActionForm';
import { InputTextField2 } from '../components/inputs/InputTextField';
import { Box, Typography } from '@mui/material';

export const CreateRole = () => {
    const {movilProps, permissionsProps, createRole, nameProps} = useRole();
    
    return (
        <ActionForm width='90%' handleSubmit={createRole}>
            <InputTextField2 labelText='Nombre del rol' width='50%' {...nameProps}/>
            <Box display='flex' width='100%' justifyContent='space-between' marginBottom={-2}>
                <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Permisos</Typography>
                <MovilPermission {...movilProps}/>
            </Box>
            <RolePermissionsTable permissions={permissionsProps}/>
        </ActionForm>
    )
}