import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchRole } from "../hooks/useSearchRole";
import { TextInputField } from "../components/inputField/TextInputField";
import { SearchRoleTable } from "../components/SearchRoleTable";
import { SearchRoleBox } from "../components/SearchRoleBox";

export const SearchRole = () => {
    const navigate = useNavigate();
    const { order, roles, page, rowsPerPage, searchRole, init, handleSort, filterRole, setPage, setRowsPerPage } = useSearchRole();

    useEffect(init, [])

    return (
        <SearchRoleBox>
            <TextInputField labelText="Nombre del rol" value={searchRole} onValueChange={filterRole}
                style={{ width: "50%" }} />
            <SearchRoleTable order={order} handleSort={handleSort} roles={roles} page={page}
                rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage}
                onViewAction={(id) => navigate(`/role/search/${id}`)} />
        </SearchRoleBox>
    );
}