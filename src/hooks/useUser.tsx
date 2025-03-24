import { useState, useEffect } from "react";
import { useUserForm } from "./useUserForm";
import { RoleApi } from "../api/role_api";
import { CreateUserProps, UpdateUserProps } from "../api/user_api";
import { voidFunction } from "../api/types";

export interface CreateUserActions {
    notSelectedRoleAction: voidFunction,
    notSelectProfilePhotoAction: voidFunction,
    notSelectedCategoriesAction: voidFunction
    alreadyExistUserAction: (user: CreateUserProps) => void,
    successUserCreationAction: voidFunction,
}

export interface UpdateUserActions {
    notSelectedRoleAction: voidFunction,
    notSelectProfilePhotoAction: voidFunction,
    notSelectedCategoriesAction: voidFunction
    alreadyExistUserAction: (user: UpdateUserProps) => void,
    successUserUpdateAction: voidFunction
}

export const useUser = () => {
    const { selectedRoles, verifyCreateUserPermissions, getCreateUserData, verifyRoles, verifyPhoto,
        verifyErrors, authApi, clearForm, register, control, handleSubmit, errors, phoneNumberError,
        emailError, nameError, dniError, birthdateError, selectedGender, setSelectedGender, birthdate,
        setBirthdate, setSelectedRoles, photo, setPhoto, creationUserType, changeCreationUserType, formRef,
        selectedCategories, setSelectedCategories, editable, verifyReadAndEditUserPermissions, discartChanges,
        setUser, getUpdateUserData, verifyUpdatePhoto, verifyUpdateRoles, active, setActive, phoneNumber, 
        setPhoneNumber, email, setEmail, name, setName, dni, setDni, address, setAddress,
        isEmployee, user, verifyCategories, verifyUpdateCategories} = useUserForm();
    const roleApi = new RoleApi();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const fechIsCategoriesOpen = async () => {
            let isOpen = false;
            for (const role of selectedRoles) {
                const permissions = await roleApi.getRolePermissions(role, "MOVIL");
                if (permissions.length > 0) {
                    isOpen = true;
                    break;
                }
            }
            setIsCategoriesOpen(isOpen);
        }
        fechIsCategoriesOpen();
    }, [selectedRoles]);

    const initCreate = (failureAction: () => void) => {
        const fetchRoles = async () => {
            await verifyCreateUserPermissions(failureAction);
            await initRoles();
        }
        fetchRoles();
    }

    const initUpdate = (userId: string, notHaveReadPermissionCase: () => void, notFoundUser: () => void) => {
        const fetchRoles = async () => {
            const user = await authApi.getUser(userId ?? "");
            await verifyReadAndEditUserPermissions(user?.roles ?? [], notHaveReadPermissionCase);
            await initRoles();
            if (user) {
                setUser(user);
                discartChanges(user);
            }
            else {
                notFoundUser(); return
            }
        }
        fetchRoles();
    }

    const initRoles = async () => {
        let roles = await roleApi.getRoles();
        roles = roles.filter((role) => role.name !== 'super_admin');
        setRoles(roles.map((role) => role.name));
    }

    const createUser = async ({ notSelectedRoleAction, notSelectProfilePhotoAction, successUserCreationAction, alreadyExistUserAction, notSelectedCategoriesAction}: CreateUserActions) => {
        const userData = getCreateUserData();
        if (verifyRoles(notSelectedRoleAction) || verifyPhoto(notSelectProfilePhotoAction)) return;
        if (isCategoriesOpen && verifyCategories(notSelectedCategoriesAction)) return;
        await authApi.createUser(userData);
        if (verifyErrors(() => alreadyExistUserAction(userData))) return;
        successUserCreationAction();
    }

    const updateUser = async ({ notSelectedRoleAction, notSelectProfilePhotoAction, successUserUpdateAction, alreadyExistUserAction, notSelectedCategoriesAction }: UpdateUserActions) => {
        const userData = getUpdateUserData();
        if (verifyUpdateRoles(notSelectedRoleAction)||verifyUpdatePhoto(notSelectProfilePhotoAction)) return;
        if (isCategoriesOpen && verifyUpdateCategories(notSelectedCategoriesAction)) return;
        const updatedUser = await authApi.updateUser(userData);
        if (verifyErrors(() => alreadyExistUserAction(userData))) return;
        successUserUpdateAction();
        setUser(updatedUser);
    }

    return {
        register,
        control,
        handleSubmit,
        errors,
        phoneNumberError,
        emailError,
        nameError,
        dniError,
        birthdateError,
        selectedGender,
        setSelectedGender,
        birthdate,
        setBirthdate,
        selectedRoles,
        setSelectedRoles,
        photo,
        setPhoto,
        createUser,
        creationUserType,
        changeCreationUserType,
        formRef,
        roles,
        initCreate,
        selectedCategories,
        setSelectedCategories,
        isCategoriesOpen,
        clearForm,
        initUpdate,
        active,
        setActive,
        phoneNumber,
        setPhoneNumber,
        email,
        setEmail,
        name,
        setName,
        dni,
        setDni,
        address,
        setAddress,
        updateUser,
        discartChanges,
        editable,
        isEmployee,
        user
    }
}