import { useRef, useState } from "react";
import { AuthUserApi, UpdateUserProps, User } from "../api/user_api";
import { useForm } from "react-hook-form";
import { selectRoleMessage, selectProfilePhotoMessage, alreadyExistsUserMessage,
    successUserUpdatedMessage
 } from "../util/alerts";
import { BACK_URL } from "../api/config";

export const useUpdateUser = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const { register, control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [dniError, setDniError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState<Date | undefined>();
    const [photo, setPhoto] = useState<string>('');
    const [active, setActive] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [dni, setDni] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const authApi = new AuthUserApi()
    const [user, setUser] = useState<User>();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const updateUser = async () => {
        const userData = getUserData();
        if (verifyRoles() || verifyPhoto()) return;
        const updatedUser = await authApi.updateUser(userData);
        if (verifyErrors(userData.email ?? "", userData.phoneNumber ?? "", userData.dni ?? "")) return;
        successUserUpdatedMessage();
        setUser(updatedUser);
    }

    const getUserData = (): UpdateUserProps => {
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
            status: active ? 'ENABLE' : 'DISABLE'
        }
    }

    const isEmployee = (): boolean => {
        return !!user?.dni;
    }

    const verifyRoles = (): boolean => {
        if (!isEmployee()) { return false }
        if (selectedRoles.length === 0) {
            selectRoleMessage();
            return true;
        }
        return false
    }

    const verifyPhoto = (): boolean => {
        if (!isEmployee()) { return false }
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

    const alreadyExistsUser = (): boolean => {
        return authApi.isError('PHONE_NUMBER_ALREADY_REGISTERED') || authApi.isError('EMAIL_ALREADY_REGISTERED')
    }

    const clearErrors = () => {
        setPhoneNumberError('');
        setEmailError('');
        setNameError('');
        setBirthdateError('');
        setDniError('');
    }

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
        photo,
        setPhoto,
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
        user,
        setUser,
        selectedRoles,
        setSelectedRoles,
        discartChanges,
        formRef,
        isEmployee
    }
}