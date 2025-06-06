import { useState, useEffect } from "react";
import { AuthUserApi, User } from "../api/user_api";
import { PermissionVerifier, Permissions } from "../api/verifyPermissions";
import { useNavigate } from "react-router-dom";
import { alreadyExistsUserMessage, successUserCreationMessage, successUserUpdatedMessage, loadingMessage } from "../utils/alerts";
import { useUserData } from "./useUserData";
import { toDateString } from "../api/utils";

export interface useUserProps {
    mode?: "create" | "read" | "update",
    userId?: string,
}

export const useUser = (props?: useUserProps) => {
    const navigate = useNavigate();
    const authApi = new AuthUserApi();
    const [mode, setMode] = useState<"create" | "read" | "update">(props?.mode ?? 'create');
    const permissionVerifier = new PermissionVerifier();
    const [user, setUser] = useState<User>();
    const [permissions, setPermissions] = useState<Permissions>();
    const {initRoles, getCreateUserData, validateData, clearInputs, getUpdateUserData,
        initData, isCategoriesOpen, creationUserType, setCreationUserType, getUserInputProps, paymentTypeController
    } = useUserData();

    useEffect(() => {
        const init = async () => {
            const permissions = await permissionVerifier.getUserAccessPermissions();
            setPermissions(permissions);
            await initRoles();
            initPermissions(permissions);
        }
        init();
    }, [])

    useEffect(() => {
        if (isCategoriesOpen && mode === 'create') {
            paymentTypeController.setValue('porcentaje');
        }
    }, [isCategoriesOpen])

    const createUser = async () => {
        const userData = getCreateUserData();
        if (!validateData(creationUserType)) return;
        loadingMessage('Creando usuario...');
        const user = await authApi.createUser(userData);
        if (!user) {
            verifyAlreadyExistUser(userData.email, userData.phoneNumber, userData.employeeData?.dni);
            return;
        }
        successUserCreationMessage(clearInputs)
    }

    const updateUser = async () => {
        const userData = getUpdateUserData(user?.id ?? '');
        const userType = userData.dni ? 'empleado' : 'cliente';
        if (!validateData(userType)) return;
        const updatedUser = await authApi.updateUser(userData);
        if (!updatedUser) {
            verifyAlreadyExistUser(userData.email??'', userData.phoneNumber??'', userData.dni);
            return;
        }
        successUserUpdatedMessage();
        setUser(updatedUser);
    }

    const initPermissions = async (permissions: Permissions) => {
        if (!permissions?.create && mode === 'create') {navigate('/')}

        if (!permissions?.read && mode === 'read') {navigate('/')}
        else if (permissions?.read && mode === 'read') {await initUser()}

    }

    const initUser = async () => {
        const user = await authApi.getUser(props?.userId ?? '');
        setUser(user);
        if (!user) return;
        initData(user);
    }

    const verifyAlreadyExistUser = (email: string, phoneNumber: string, dni?: string) => {
        if ((authApi.isError('PHONE_NUMBER_ALREADY_REGISTERED') || authApi.isError('EMAIL_ALREADY_REGISTERED'))){
            alreadyExistsUserMessage(email, phoneNumber, dni);
        }
    }

    const isSuperAdmin = () => {
        return user?.roles?.includes('super_admin') ?? false;
    }

    return {
        createUser,
        user,
        isCategoriesOpen,
        updateUser,
        permissions,
        userInputProps: {
            ...getUserInputProps(toDateString(user?.createdDate ?? new Date())),
            isSuperAdmin: isSuperAdmin(),
        },
        creationUserType,
        setCreationUserType,
        mode,
        setMode,
        discartChanges: () => initData(user ?? {} as User),
    }
}
