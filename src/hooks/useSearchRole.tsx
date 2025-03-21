import { AccessPermission, RoleApi } from "../api/role_api";
import { useState } from "react";
import { AuthUserApi } from "../api/user_api";

export interface RoleData {
    id: string;
    name: string;
    accesses: AccessPermission[];
    numUsers: number;
}

export const useSearchRole = () => {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [allRoles, setAllRoles] = useState<RoleData[]>([]);
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchRole, setSearchRole] = useState<string>("");
    const roleApi = new RoleApi();
    const userApi = new AuthUserApi();

    const init = () => {
        const fetchRoles = async () => {
            const roles = await roleApi.getRoles();
            roles.sort((a, b) => a.name.localeCompare(b.name));
            const rolesData: RoleData[] = await Promise.all(
                roles.map(async (role) => ({
                    id: role.id,
                    name: role.name,
                    accesses: role.accesses,
                    numUsers: await userApi.getUsersByRole(role.name).then(users => users.length)
                }))
            );
            setAllRoles(rolesData);
            setRoles(rolesData);
        }
        fetchRoles();
    }

    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setRoles(roles.reverse());
    };

    const filterRole = (searchRole: string) => {
        setSearchRole(searchRole);
        if (searchRole === "") {
            setRoles(allRoles);
            return;
        }
        const filteredRoles = allRoles.filter((role) => role.name.toLowerCase().startsWith(searchRole.toLowerCase()));
        setRoles(filteredRoles);
        setPage(0);
        setRowsPerPage(5);
    }

    return {
        order,
        roles,
        page,
        rowsPerPage,
        searchRole,
        init,
        handleSort,
        filterRole,
        setPage,
        setRowsPerPage
    }
}