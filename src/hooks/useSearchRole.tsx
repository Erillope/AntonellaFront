import { RoleApi } from "../api/role_api";
import { useEffect, useState } from "react";
import { AuthUserApi } from "../api/user_api";
import { useInputTextField } from "../components/inputs/InputTextField";
import { RoleData } from "../components/tables/RoleTable";

export const useSearchRole = () => {
    const [allRoles, setAllRoles] = useState<RoleData[]>([]);
    const [roles, setRoles] = useState<RoleData[]>([]);
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
                    numUsers: await userApi.getUsersByRole(role.name).then(users => users.length)
                }))
            );
            setAllRoles(rolesData);
            setRoles(rolesData);
        }
        init();
    }, [])

    const filterRole = () => {
        if (searchRoleController.isEmpty()) {
            setRoles(allRoles);
            return;
        }
        const filteredRoles = allRoles.filter((role) => role.name.toLowerCase().includes(searchRoleController.value.toLowerCase()));
        setRoles(filteredRoles);
    }

    useEffect(filterRole, [searchRoleController.value])

    return {
        roles,
        searchRoleProps: searchRoleController.getProps(),
    }
}