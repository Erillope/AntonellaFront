import { useRef, useState } from "react";
import { PermissionVerifier } from "../api/verifyPermissions";
import { AuthUserApi, CreateUserProps, UpdateUserProps, User } from "../api/user_api";
import { useForm } from "react-hook-form";
import { BACK_URL } from "../api/config";

export const useUserForm = () => {
    const [creationUserType, setCreationUserType] = useState<"empleado" | "cliente">('cliente');
    const formRef = useRef<HTMLFormElement>(null);
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
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [editable, setEditable] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [dni, setDni] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [active, setActive] = useState(true);
    const [user, setUser] = useState<User>();

    const verifyCreateUserPermissions = async (action: () => void) => {
        const permissions = await permissionVerifier.getUserAccessPermissions();
        if (!permissions.create) {
            action();
        }
    }

    const verifyReadAndEditUserPermissions = async (selectedUserRoles: string[],
        notHaveReadPermissionCase: () => void) => {

        const authApi = new AuthUserApi();
        const permissions = await permissionVerifier.getUserAccessPermissions()
        if (!permissions.read) {
            notHaveReadPermissionCase(); return
        }
        const loggedUser = authApi.getLoggedUser();
        if (selectedUserRoles.includes('super_admin')) {
            setEditable(!!loggedUser?.roles?.includes('super_admin'));
        }
        else { setEditable(permissions.edit) }
    }

    const verifyRoles = (notSelectedRoleAction: () => void): boolean => {
        if (creationUserType === 'cliente') { return false }
        if (selectedRoles.length === 0) {
            notSelectedRoleAction();
            return true;
        }
        return false
    }

    const verifyPhoto = (notSelectProfilePhotoAction: () => void): boolean => {
        if (creationUserType === 'cliente') { return false }
        if (photo === '') {
            notSelectProfilePhotoAction();
            return true;
        }
        return false
    }

    const verifyCategories = (notSelectedCategoriesAction: () => void): boolean => {
        if (creationUserType === 'cliente') { return false }
        if (selectedCategories.length === 0) {
            notSelectedCategoriesAction();
            return true;
        }
        return false
    }

    const isEmployee = (): boolean => {
        return !!user?.dni;
    }

    const verifyUpdateRoles = (notSelectProfilePhotoAction: () => void): boolean => {
        if (!isEmployee()) { return false }
        if (selectedRoles.length === 0) {
            notSelectProfilePhotoAction();
            return true;
        }
        return false
    }

    const verifyUpdatePhoto = (notSelectProfilePhotoAction: () => void): boolean => {
        if (!isEmployee()) { return false }
        if (photo === '') {
            notSelectProfilePhotoAction();
            return true;
        }
        return false
    }

    const verifyUpdateCategories = (notSelectedCategoriesAction: () => void): boolean => {
        if (!isEmployee()) { return false }
        if (selectedCategories.length === 0) {
            notSelectedCategoriesAction();
            return true;
        }
        return false
    }

    const verifyErrors = (alreadyExistUserAction: () => void): boolean => {
        clearErrors();
        if (alreadyExistsUser()) {
            alreadyExistUserAction();
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
        setSelectedCategories([]);
    };

    const discartChanges = (user: User) => {
        setPhoneNumber(user.phoneNumber);
        setValue('phoneNumber', user.phoneNumber);
        setEmail(user.email);
        setValue('email', user.email);
        setName(user.name);
        setValue('name', user.name);
        setSelectedGender(user.gender);
        setValue('gender', user.gender)
        setBirthdate(user.birthdate);
        setValue('birthdate', user.birthdate);
        setDni(user.dni ?? '');
        setValue('dni', user.dni);
        setPhoto(BACK_URL + user.photo);
        setAddress(user.address ?? '');
        setValue('address', user.address);
        setSelectedRoles(user.roles ?? []);
        setActive(user.status === 'ENABLE')
        setSelectedCategories(user.categories ?? []);
    }

    const changeCreationUserType = (changeToClient: () => void, changeToEmployee: () => void) => {
        if (creationUserType === "empleado") {
            setCreationUserType("cliente");
            changeToClient();
        } else {
            setCreationUserType("empleado");
            changeToEmployee();
        }
    }

    const getCreateUserData = (): CreateUserProps => {
        return {
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate ?? new Date(),
            employeeData: creationUserType === 'empleado' ? {
                dni: getValues('dni'),
                address: getValues('address'),
                photo: photo.split(',')[1],
                roles: selectedRoles,
                categories: selectedCategories
            } : undefined
        }
    }

    const getUpdateUserData = (): UpdateUserProps => {
        return {
            id: user?.id ?? '',
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate ?? new Date(),
            dni: getValues('dni'),
            address: getValues('address'),
            photo: photo.split(',')[1],
            roles: selectedRoles,
            status: active ? 'ENABLE' : 'DISABLE',
            categories: selectedCategories
        }
    }

    return {
        selectedRoles,
        verifyCreateUserPermissions,
        getCreateUserData,
        verifyRoles,
        verifyPhoto,
        verifyErrors,
        authApi,
        clearForm,
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
        setSelectedRoles,
        photo,
        setPhoto,
        creationUserType,
        changeCreationUserType,
        formRef,
        selectedCategories,
        setSelectedCategories,
        editable,
        verifyReadAndEditUserPermissions,
        discartChanges,
        getUpdateUserData,
        user,
        setUser,
        verifyUpdatePhoto,
        verifyUpdateRoles,
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
        isEmployee,
        verifyCategories,
        verifyUpdateCategories
    }
}