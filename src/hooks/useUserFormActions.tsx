import { JSX, useState } from "react";
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Person } from '@mui/icons-material';
import { CreateUserProps, UpdateUserProps } from "../api/user_api";
import { voidFunction } from "../api/types";
import { CreateUserActions, UpdateUserActions } from "./useUser";
import { selectRoleMessage, selectProfilePhotoMessage, alreadyExistsUserMessage, successUserCreationMessage,
    successUserUpdatedMessage, categoriesNotSelectedMessage
} from '../util/alerts';
import { useNavigate } from "react-router-dom";

interface UserFormActionsProps {
    changeCreationUserType?: (toClient: voidFunction, toEmployee: voidFunction) => void,
    createUser?: (actions: CreateUserActions) => void,
    clearForm?: voidFunction
    updateUser?: (actions: UpdateUserActions) => void
}

export const useUserFormActions = ({ changeCreationUserType, createUser, clearForm,
    updateUser}: UserFormActionsProps) => {

    const navigate = useNavigate();
    const [userTypeClass, setUserTypeClass] = useState<string>("submit-button2");
    const [userTypeIcon, setUserTypeIcon] = useState<JSX.Element>(<EngineeringIcon />);

    const toClient = () => { setUserTypeClass("submit-button2"); setUserTypeIcon(<EngineeringIcon />) }

    const toEmployee = () => { setUserTypeClass("submit-button"); setUserTypeIcon(<Person />) }

    const changeUserType = () => changeCreationUserType?.(toClient, toEmployee);

    const alreadyExistsUserAction = (email: string, phoneNumber: string, dni: string | undefined) => 
        alreadyExistsUserMessage(email, phoneNumber, dni);

    const handleCreateUser = () => createUser?.({
        notSelectedRoleAction: selectRoleMessage,
        notSelectProfilePhotoAction: selectProfilePhotoMessage,
        alreadyExistUserAction: (user: CreateUserProps) => alreadyExistsUserAction(
            user.email, user.phoneNumber, user.employeeData?.dni),
        successUserCreationAction: () => clearForm && successUserCreationMessage(clearForm),
        notSelectedCategoriesAction: categoriesNotSelectedMessage
    });

    const failureCreateAction = () => navigate('/');

    const notHaveReadPermissionCase = () => navigate('/');

    const notFoundUser = () => navigate('/user/search/');

    const handleUpdateUser = () => updateUser?.({
        notSelectedRoleAction: selectRoleMessage,
        notSelectProfilePhotoAction: selectProfilePhotoMessage,
        alreadyExistUserAction: (user: UpdateUserProps) => alreadyExistsUserAction(
            user.email??'', user.phoneNumber??'', user.dni),
        successUserUpdateAction: successUserUpdatedMessage,
        notSelectedCategoriesAction: categoriesNotSelectedMessage
    })

    return {
        userTypeClass,
        userTypeIcon,
        changeUserType,
        handleCreateUser,
        failureCreateAction,
        notHaveReadPermissionCase,
        notFoundUser,
        handleUpdateUser
    }
    
}