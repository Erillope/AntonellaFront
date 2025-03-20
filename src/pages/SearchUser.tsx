import { useNavigate } from "react-router-dom";
import "../styles/table.css";
import { useSearchUser } from "../hooks/useSearchUser";
import { useEffect } from "react";
import { UserSearchFilters } from "../components/userSearchFilters";
import { UserSearchTable } from "../components/UserSearchTable";

export const SearchUser = () => {
    const navigate = useNavigate();
    const {users, roles, selectedRole, name, email, phoneNumber, dni, page, rowsPerPage, init, handleSort,
        selectRole, filterByName, filterByEmail, filterByPhoneNumber, filterByDni, setDni, setEmail,
        setName, setPhoneNumber, setPage, setRowsPerPage, order } = useSearchUser();

    useEffect(init, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <UserSearchFilters name={name} onChangeName={setName} onSearchName={filterByName}
                phoneNumber={phoneNumber} onChangePhoneNumber={setPhoneNumber}
                onSearchPhoneNumber={filterByPhoneNumber} email={email} onChangeEmail={setEmail}
                onSearchEmail={filterByEmail} dni={dni} onChangeDni={setDni} onSearchDni={filterByDni}
                roles={roles} selectedRole={selectedRole} onSelectRole={selectRole}/>
            <UserSearchTable order={order} handleSort={handleSort} users={users} page={page}
                rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage}
                onViewAction={(id) => navigate(`/user/search/${id}`)}/>
        </div>
    );
}