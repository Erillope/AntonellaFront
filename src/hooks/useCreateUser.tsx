import { AuthUserApi, CreateUserProps } from "../api/user_api";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
    alreadyExistsUserMessage, successUserCreationMessage, selectRoleMessage,
    selectProfilePhotoMessage
} from "../util/alerts";
import { RoleApi } from "../api/role_api";
import { PermissionVerifier } from "../api/verifyPermissions";

export const useCreateUser = (type: "empleado" | "cliente",
    changeToClient: () => void, changeToEmployee: () => void
) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [userType, setUserType] = useState(type);
    const { register, control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [dniError, setDniError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState<Date | undefined>();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [photo, setPhoto] = useState<string>('');
    const authApi = new AuthUserApi()
    const permissionVerifier = new PermissionVerifier();
    const roleApi = new RoleApi();
    const [roles, setRoles] = useState<string[]>([]);

    const init = (failureAction: () => void) => {
        const fetchRoles = async () => {
            await verifyCreateUserPermissions(failureAction);
            let roles = await roleApi.getRoles();
            roles = roles.filter((role) => role.name !== 'super_admin');
            setRoles(roles.map((role) => role.name));
        }
        fetchRoles();
    }

    const verifyCreateUserPermissions = async (action: () => void) => {
        const permissions = await permissionVerifier.getUserAccessPermissions();
        if (!permissions.create) {
            action();
        }
    }

    const createUser = async () => {
        const userData = getUserData();
        console.log(getUserData())
        if (verifyRoles() || verifyPhoto()) return;
        await authApi.createUser(userData);
        if (verifyErrors(userData.email, userData.phoneNumber, userData.employeeData?.dni)) return;
        successUserCreationMessage(clearForm);
    }

    const getUserData = (): CreateUserProps => {
        return {
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate ?? new Date(),
            employeeData: userType === 'empleado' ? {
                dni: getValues('dni'),
                address: getValues('address'),
                photo: photo.split(',')[1],
                roles: selectedRoles
            } : undefined
        }
    }

    const verifyRoles = (): boolean => {
        if (userType === 'cliente') { return false }
        if (selectedRoles.length === 0) {
            selectRoleMessage();
            return true;
        }
        return false
    }

    const verifyPhoto = (): boolean => {
        if (userType === 'cliente') { return false }
        if (photo === '') {
            selectProfilePhotoMessage();
            return true;
        }
        return false
    }

    const verifyErrors = (email: string, phoneNumber: string, dni: string | undefined): boolean => {
        clearErrors();
        if (alreadyExistsUser()) {
            alreadyExistsUserMessage(email, phoneNumber, dni);
            return true;
        };
        if (authApi.isError('INVALID_PHONE_NUMBER')) {
            setPhoneNumberError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_EMAIL')) {
            setEmailError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_NAME')) {
            setNameError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_BIRTHDATE')) {
            setBirthdateError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_DNI')) {
            setDniError(authApi.getErrorMessage());
            return true;
        }
        return false
    }

    const clearErrors = () => {
        setPhoneNumberError('');
        setEmailError('');
        setNameError('');
        setBirthdateError('');
        setDniError('');
    }

    const alreadyExistsUser = (): boolean => {
        return authApi.isError('PHONE_NUMBER_ALREADY_REGISTERED') || authApi.isError('EMAIL_ALREADY_REGISTERED')
    }

    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        setPhoto('')
        setSelectedGender('');
        setValue('gender', null);
        setSelectedRoles([]);
        setBirthdate(undefined)
        setValue('birthdate', null);
    };

    const changeUserType = () => {
        if (userType === "empleado") {
            setUserType("cliente");
            changeToClient();
        } else {
            setUserType("empleado");
            changeToEmployee();
        }
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
        userType,
        changeUserType,
        formRef,
        roles,
        init
    }
}