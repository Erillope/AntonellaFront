import { useEffect, useState } from "react";
import { AuthUserApi, FilterUserProps, User } from "../api/user_api";
import { RoleApi } from "../api/role_api";
import { useSelectInput } from "../components/inputs/SelectInput";
import { useInputTextField } from "../components/inputs/InputTextField";
import { UserSearchFiltersProps } from "../components/inputs/userInputs/UserSearchFilters";
import { useNavigate } from "react-router-dom";
import { PermissionVerifier } from "../api/verifyPermissions";

export const useSearchUser = () => {
    const navigate = useNavigate();
    const nameController = useInputTextField();
    const emailController = useInputTextField();
    const phoneNumberController = useInputTextField();
    const dniController = useInputTextField();
    const roleControler = useSelectInput();
    const [page, setPage] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const authApi = new AuthUserApi();
    const permissionVerifier = new PermissionVerifier()
    const roleApi = new RoleApi();

    useEffect(() => {
        const init = async () => {
            const usersData = await authApi.filterUsers({limit: 5})
            if (usersData) {
                setTotalUsers(usersData.total);
                setUsers(usersData.users);
            }
            const allRoles = await roleApi.getRoles();
            const permissions = await permissionVerifier.getUserAccessPermissions();
            if (!permissions.read) {navigate('/')}
            roleControler.setValue("Todos");
            roleControler.setValues(["Todos", ...allRoles.map(role => role.name)]);
        }
        init();
    }, [])

    const getFilterProps = (offset: number, limit: number): FilterUserProps => {
        return {
            offset,
            limit,
            name: nameController.isEmpty() ? undefined : nameController.value,
            email: emailController.isEmpty() ? undefined : emailController.value,
            phoneNumber: phoneNumberController.isEmpty() ? undefined : phoneNumberController.value,
            dni: dniController.isEmpty() ? undefined : dniController.value,
            role: roleControler.value === "Todos" ? undefined : roleControler.isEmpty() ? undefined : roleControler.value,
        }
    }

    const filter = async (): Promise<User[]> => {
        const usersData = await authApi.filterUsers(getFilterProps(0, 5));
        setPage(0)
        if (usersData) {
            setTotalUsers(usersData.filteredCount);
            setUsers(usersData.users);
            return usersData.users;
        }
        return [];
    }

    const onChangePage = async (page: number) => {
        const offset = page * 5;
        const limit = 5;
        const usersData = await authApi.filterUsers(getFilterProps(offset, limit));
        setPage(page)
        if (usersData) {
            setTotalUsers(usersData.filteredCount);
            setUsers(usersData.users);
            return usersData.users;
        }
        return [];
    }

    useEffect(() => {filter()}, [nameController.value, emailController.value, phoneNumberController.value, dniController.value, roleControler.value])


    const getFilterUserProps = (): UserSearchFiltersProps => {
        return {
            nameProps: nameController.getProps(),
            emailProps: emailController.getProps(),
            phoneProps: phoneNumberController.getProps(),
            dniProps: dniController.getProps(),
            rolesProps: roleControler.getProps(),
        }
    }
    return {
        filterUserProps: getFilterUserProps(),
        filter,
        users,
        totalUsers,
        page,
        onChangePage
    }
}