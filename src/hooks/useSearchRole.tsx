import { RoleApi } from "../api/role_api";
import { useEffect, useState } from "react";
import { AuthUserApi } from "../api/user_api";
import { useInputTextField } from "../components/inputs/InputTextField";
import { RoleData } from "../components/tables/RoleTable";

export const useSearchRole = () => {
    const [allRoles, setAllRoles] = useState<RoleData[]>([]);
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [page, setPage] = useState(0);
    const [totalRoles, setTotalRoles] = useState(0);
    const searchRoleController = useInputTextField()
    const roleApi = new RoleApi();
    const userApi = new AuthUserApi();

    useEffect(() => {
        const init = async () => {
            const roles = await roleApi.getRoles();
            roles.sort((a, b) => a.name.localeCompare(b.name));
            const rolesData: RoleData[] = await Promise.all(
                roles.map(async (role) => ({
                    id: role.id,
                    name: role.name,
                    accesses: role.accesses,
                    numUsers: await userApi.filterUsers({role: role.name, onlyCount: true}).then((data) => data?.filteredCount?? 0)
                }))
            );
            setAllRoles(rolesData);
            setRoles(rolesData.slice(0, 5));
            setTotalRoles(rolesData.length);
        }
        init();
    }, [])

    const filterRole = () => {
        setPage(0);
        if (searchRoleController.isEmpty()) {
            setRoles(allRoles.slice(0,5));
            setTotalRoles(allRoles.length);
            return;
        }
        const filteredRoles = allRoles.filter((role) => role.name.toLowerCase().includes(searchRoleController.value.toLowerCase()));
        setRoles(filteredRoles);
        setTotalRoles(filteredRoles.length);
    }

    useEffect(filterRole, [searchRoleController.value])

    const onChangePage = (newPage: number) => {
        setPage(newPage);
        const offset = newPage * 5;
        const paginatedRoles = allRoles.slice(offset, offset + 5);
        setRoles(paginatedRoles);
    }

    return {
        roles,
        searchRoleProps: searchRoleController.getProps(),
        onChangePage,
        page,
        totalRoles,
    }
}