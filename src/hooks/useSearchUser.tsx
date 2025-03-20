import { useState } from "react";
import { AuthUserApi, User } from "../api/user_api";
import { RoleApi } from "../api/role_api";


export const useSearchUser = () => {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState("Todos");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dni, setDni] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const authApi = new AuthUserApi();
    const roleApi = new RoleApi();

    const init = () => {
        const fetchRoles = async () => {
            const allUsers = await authApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
            const roles = (await roleApi.getRoles()).map(role => role.name);
            roles.unshift("Todos");
            setUsers(allUsers);
            setAllUsers(allUsers);
            setRoles(roles);
        }
        fetchRoles();
    }

    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setUsers(users.reverse());
    };

    const selectRole = (role: string) => {
        setSelectedRole(role);
        if (role === "Todos") {
            setUsers(allUsers);
        }
        else {
            setUsers(allUsers.filter(user => user.roles?.includes(role)));
        }
        clearFilters();
    }

    const filterByName = () => {
        const filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setName(name);
    }

    const filterByEmail = () => {
        const filteredUsers = allUsers.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setEmail(email);
    }

    const filterByPhoneNumber = () => {
        const filteredUsers = allUsers.filter(user => user.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setPhoneNumber(phoneNumber);
    }

    const filterByDni = () => {
        const filteredUsers = allUsers.filter(user => user.dni?.toLowerCase().includes(dni.toLowerCase()));
        setUsers(filteredUsers)
        clearFilters();
        setDni(dni);
    }

    const clearFilters = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setDni("");
        setPage(0);
        setRowsPerPage(5);
    }

    return {
        users,
        roles,
        selectedRole,
        name,
        email,
        phoneNumber,
        dni,
        page,
        rowsPerPage,
        init,
        handleSort,
        selectRole,
        filterByName,
        filterByEmail,
        filterByPhoneNumber,
        filterByDni,
        clearFilters,
        setPage,
        setName,
        setEmail,
        setPhoneNumber,
        setDni,
        setRowsPerPage,
        order
    }
}