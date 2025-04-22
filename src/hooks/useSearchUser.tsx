import { useEffect, useState } from "react";
import { AuthUserApi, User } from "../api/user_api";
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

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const authApi = new AuthUserApi();
    const permissionVerifier = new PermissionVerifier()
    const roleApi = new RoleApi();

    useEffect(() => {
        const init = async () => {
            const allUsers = await authApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
            const allRoles = await roleApi.getRoles();
            const permissions = await permissionVerifier.getUserAccessPermissions();
            if (!permissions.read) {navigate('/')}
            roleControler.setValue("Todos");
            roleControler.setValues(["Todos", ...allRoles.map(role => role.name)]);
            setAllUsers(allUsers);
            setFilteredUsers(allUsers);
        }
        init();
    }, [])

    const filterUsers = () => {
        const _filteredUsers = allUsers.filter(user => includesName(user)).
            filter(user => includesEmail(user)).
            filter(user => includesPhoneNumber(user)).
            filter(user => includesDni(user)).
            filter(user => filterByRole(user))
        setFilteredUsers(_filteredUsers);
    }

    useEffect(filterUsers, [nameController.value, emailController.value, phoneNumberController.value, dniController.value, roleControler.value])

    const includesName = (user: User): boolean => {
        if (nameController.isEmpty()) return true;
        return user.name.toLowerCase().includes(nameController.value.toLowerCase())
    }

    const includesEmail = (user: User): boolean => {
        if (emailController.isEmpty()) return true;
        return user.email.toLowerCase().includes(emailController.value.toLowerCase())
    }

    const includesPhoneNumber = (user: User): boolean => {
        if (phoneNumberController.isEmpty()) return true;
        return user.phoneNumber.toLowerCase().includes(phoneNumberController.value.toLowerCase())
    }

    const includesDni = (user: User): boolean => {
        if (dniController.isEmpty()) return true;
        return user.dni?.toLowerCase().includes(dniController.value.toLowerCase()) ?? false
    }

    const filterByRole = (user: User): boolean => {
        if (roleControler.isEmpty()) return true;
        if (roleControler.value === "Todos") return true;
        if (!user.roles) return false;
        return user.roles.some(role => role === roleControler.value)
    }

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
        filteredUsers
    }
}