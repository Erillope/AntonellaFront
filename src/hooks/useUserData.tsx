import { useEffect, useState } from "react";
import { useDateInput } from "../components/inputs/DateInput";
import { useDynamicMultipleSelect } from "../components/inputs/DynamicMultipleSelect";
import { useImageInput } from "../components/inputs/ImageInput";
import { useInputTextField } from "../components/inputs/InputTextField";
import { useMultipleSelect } from "../components/inputs/MultipleSelect";
import { useSelectInput } from "../components/inputs/SelectInput";
import { movilCategories } from "../api/config";
import { RoleApi } from "../api/role_api";
import { CreateUserProps, UpdateUserProps, User } from "../api/user_api";
import { validatePhoneNumber, validateEmail, validateUserName, validateBirthDate, validateDni } from "../utils/validators";
import { UserInputsProps } from "../components/inputs/userInputs/UserInputs";
import { useSwitchInput } from "../components/inputs/SwitchInput";
import { capitalizeFirstLetter } from "../api/utils";

export const useUserData = () => {
    const phoneController = useInputTextField();
    const emailController = useInputTextField();
    const nameController = useInputTextField();
    const dniController = useInputTextField();
    const rolesController = useDynamicMultipleSelect();
    const genderController = useSelectInput({ values: ['Masculino', 'Femenino'] });
    const birthdateController = useDateInput();
    const addressController = useInputTextField();
    const movilController = useMultipleSelect();
    const photoController = useImageInput();
    const paymentTypeController = useSelectInput({ values: ['Porcentaje', 'Salario', 'Mixto'] });
    const statusController = useSwitchInput()

    const [creationUserType, setCreationUserType] = useState<"empleado" | "cliente">('cliente');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const roleApi = new RoleApi();

    useEffect(() => {
        const fechIsCategoriesOpen = async () => {
            movilController.setValues(movilCategories)
            let isOpen = false;
            for (const role of rolesController.selectedValues) {
                const permissions = await roleApi.getRolePermissions(role, "MOVIL");
                if (permissions.length > 0) {
                    isOpen = true;
                    break;
                }
            }
            if (!isOpen) {
                movilController.clearInput()
                paymentTypeController.clearInput();
            }
            setIsCategoriesOpen(isOpen);
        }
        fechIsCategoriesOpen();
    }, [rolesController.selectedValues]);

    const initRoles = async () => {
        let roles = await roleApi.getRoles();
        roles = roles.filter((role) => role.name !== 'super_admin');
        rolesController.setValues(roles.map((role) => role.name));
    }

    const initData = (user: User) => {
        phoneController.setValue(user.phoneNumber);
        emailController.setValue(user.email);
        nameController.setValue(user.name);
        dniController.setValue(user.dni ?? '');
        addressController.setValue(user.address ?? '');
        rolesController.setSelectedValues(user.roles ?? []);
        genderController.setValue(user.gender ?? '');
        birthdateController.setValue(user.birthdate ?? new Date());
        movilController.setSelectedValues(user.categories ?? []);
        paymentTypeController.setValue(user.paymentType ?? 'Porcentaje');
        photoController.setValue(user.photo ?? '');
        statusController.setActive(user.status === 'ENABLE');
    }

    const getCreateUserData = (): CreateUserProps => {
        return {
            phoneNumber: phoneController.value,
            email: emailController.value,
            name: nameController.value,
            gender: genderController.value,
            birthdate: birthdateController.value,
            employeeData: creationUserType === 'cliente' ? undefined : {
                dni: dniController.value,
                address: addressController.value,
                photo: photoController.value,
                categories: movilController.selectedValues,
                roles: rolesController.selectedValues,
                paymentType: paymentTypeController.value.toLowerCase(),
            }

        }
    }

    const getUpdateUserData = (userId: string): UpdateUserProps => {
        return {
            id: userId,
            phoneNumber: phoneController.value,
            email: emailController.value,
            name: nameController.value,
            gender: genderController.value,
            birthdate: birthdateController.value,
            dni: dniController.value,
            address: addressController.value,
            photo: photoController.value,
            roles: rolesController.selectedValues,
            categories: movilController.selectedValues,
            status: statusController.active ? 'ENABLE' : 'DISABLE',
            paymentType: paymentTypeController.value.toLowerCase(),
        }
    }

    const validateData = (type: 'cliente' | 'empleado') => {
        clearErrors();
        let isValid = validateClientUserData();
        if (type === 'empleado') { isValid = validateEmployeeData() && isValid }
        return isValid
    }

    const validateClientUserData = (): boolean => {
        let isValid = true;
        if (phoneController.isEmpty()) {
            phoneController.setError('El teléfono es requerido');
            isValid = false;
        }
        if (emailController.isEmpty()) {
            emailController.setError('El email es requerido');
            isValid = false;
        }
        if (nameController.isEmpty()) {
            nameController.setError('El nombre es requerido');
            isValid = false;
        }
        if (genderController.isEmpty()) {
            genderController.setError('El género es requerido');
            isValid = false;
        }
        if (!validatePhoneNumber(phoneController.value)) {
            phoneController.setError('El teléfono es inválido');
            isValid = false;
        }
        if (!validateEmail(emailController.value)) {
            emailController.setError('El email es inválido');
            isValid = false;
        }
        if (!validateUserName(nameController.value)) {
            nameController.setError('El nombre es inválido');
            isValid = false;
        }
        if (!validateBirthDate(birthdateController.value)) {
            birthdateController.setError('La fecha de nacimiento es inválida');
            isValid = false;
        }
        return isValid
    }

    const validateEmployeeData = (): boolean => {
        let isValid = true;
        if (photoController.isEmpty()) {
            photoController.setError('La foto de perfil es requerida');
            isValid = false;
        }
        if (dniController.isEmpty()) {
            dniController.setError('El DNI es requerido');
            isValid = false;
        }
        if (addressController.isEmpty()) {
            addressController.setError('La dirección es requerida');
            isValid = false;
        }
        if (rolesController.isEmpty()) {
            rolesController.setError('Los roles son requeridos');
            isValid = false;
        }
        if (photoController.isEmpty()) {
            photoController.setError('La foto de perfil es requerida');
            isValid = false;
        }
        if (isCategoriesOpen && movilController.isEmpty()) {
            movilController.setError('Las categorias son requeridas');
            isValid = false;
        }
        if (!validateDni(dniController.value)) {
            dniController.setError('El DNI es inválido');
            isValid = false;
        }
        return isValid;
    }

    const clearErrors = () => {
        phoneController.clearError();
        emailController.clearError();
        nameController.clearError();
        dniController.clearError();
        addressController.clearError();
        rolesController.clearError();
        genderController.clearError();
        birthdateController.clearError();
        movilController.clearError();
        photoController.clearError();
    }

    const clearInputs = () => {
        phoneController.clearInput();
        emailController.clearInput();
        nameController.clearInput();
        dniController.clearInput();
        addressController.clearInput();
        rolesController.clearInput();
        genderController.clearInput();
        birthdateController.clearInput();
        paymentTypeController.setValue('Porcentaje');
        movilController.clearInput();
        photoController.clearInput();
    }

    const getUserInputProps = (creationDate: string): UserInputsProps => {
        return {
            phoneProps: phoneController.getProps(),
            emailProps: emailController.getProps(),
            nameProps: nameController.getProps(),
            genderProps: genderController.getProps(),
            birthdateProps: birthdateController.getProps(),
            addressProps: addressController.getProps(),
            dniProps: dniController.getProps(),
            rolesProps: rolesController.getProps(),
            movilProps: movilController.getProps(),
            photoProps: photoController.getProps(),
            statusProps: statusController.getProps(),
            showCategories: isCategoriesOpen,
            creationDate: creationDate,
            paymentTypeProps: {
                ...paymentTypeController.getProps(),
                value: capitalizeFirstLetter(paymentTypeController.value),
            },
        }
    }

    return {
        initRoles,
        getCreateUserData,
        validateData,
        clearInputs,
        getUserInputProps,
        getUpdateUserData,
        initData,
        isCategoriesOpen,
        creationUserType,
        setCreationUserType,
        paymentTypeController,
    }
}