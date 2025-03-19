import { Button } from "@mui/material";
import React, { JSX } from "react";

interface CreateUserHeaderProps {
    userType: string;
    buttonClass: string;
    buttonIcon: JSX.Element;
    changeUserType: () => void;
}

export const CreateUserHeader: React.FC<CreateUserHeaderProps> = ({ userType, buttonClass,
    buttonIcon, changeUserType }) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <HeaderMessage />
            <UserTypeButton userType={userType} buttonClass={buttonClass}
                buttonIcon={buttonIcon} changeUserType={changeUserType} />
        </div>
    )

}

const HeaderMessage = () => {
    return (
        <div style={{ width: "70%", flex: "1 0 70%" }}>
            <p style={{ fontWeight: "bold" }}>
                Por favor, complete los campos a continuación para registrar un nuevo usuario. Asegúrese de proporcionar información precisa para garantizar un proceso exitoso.
            </p>
        </div>
    )
}

const UserTypeButton: React.FC<CreateUserHeaderProps> = ({ userType, buttonClass,
    buttonIcon, changeUserType }) => {

    return (
        <div style={{ flex: "1 0 30%", display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button className={buttonClass} endIcon={buttonIcon} onClick={changeUserType}>
                Crear {userType == 'cliente' ? 'Empleado' : 'Cliente'}
            </Button>
        </div>
    )
}