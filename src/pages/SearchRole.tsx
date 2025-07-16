import { useSearchRole } from "../hooks/useSearchRole";
import { RoleTable } from "../components/tables/RoleTable";
import { InputTextField2 } from "../components/inputs/InputTextField";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export const SearchRole = () => {
    const navigate = useNavigate();
    const { searchRoleProps, roles, page, onChangePage, totalRoles } = useSearchRole();

    return (
        <Box width="90%" gap={2} display="flex" flexDirection="column">
            <InputTextField2 labelText="Nombre del rol" width="50%" {...searchRoleProps}/>
            <RoleTable roles={roles} onViewAction={(id: string) => navigate(`/role/search/${id}`)}
                totalRoles={totalRoles} page={page} onChangePage={onChangePage}/>
        </Box>
    );
}