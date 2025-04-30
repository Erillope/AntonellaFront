import { Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import EngineeringIcon from '@mui/icons-material/Engineering';

interface CreateUserHeaderProps {
    userType?: "cliente" | "empleado";
    onChangeUserType?: (userType: "cliente" | "empleado") => void;
}

export const CreateUserHeader: React.FC<CreateUserHeaderProps> = ({ userType, onChangeUserType }) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <HeaderMessage />
            <UserTypeButton userType={userType} onChangeUserType={onChangeUserType}/>
        </div>
    )

}

const HeaderMessage = () => {
    return (
        <div style={{ width: "70%", flex: "1 0 70%" }}>
            <p style={{ fontWeight: "bold", fontSize: '14px' }}>
                Por favor, complete los campos a continuación para registrar un nuevo usuario. Asegúrese de proporcionar información precisa para garantizar un proceso exitoso.
            </p>
        </div>
    )
}

const UserTypeButton: React.FC<CreateUserHeaderProps> = ({ userType, onChangeUserType }) => {
    const icon = userType === 'cliente' ?  <EngineeringIcon /> : <Person/>;
    const changeUserType = () => {
        if (onChangeUserType) {
            onChangeUserType(userType === 'cliente' ? 'empleado' : 'cliente');
        }
    }

    return (
        <div style={{ flex: "1 0 30%", display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button  endIcon={icon} onClick={changeUserType} sx={{ backgroundColor: "#F44565", color: 'white', borderRadius: 5, paddingLeft: 2, paddingRight: 2 }}>
                Crear {userType == 'cliente' ? 'Empleado' : 'Cliente'}
            </Button>
        </div>
    )
}