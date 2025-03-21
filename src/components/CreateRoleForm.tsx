import { Button } from "@mui/material"
import React from "react";

interface CreateRoleFormProps {
    handleSubmit: () => () => void;
    formRef: any;
    children?: React.ReactNode;
}

export const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ handleSubmit, formRef, children }) => {
    const childrenArray = React.Children.toArray(children);
    return (
        <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            onSubmit={handleSubmit()} ref={formRef}>
            <div style={{ width: "90%" }}>
                {childrenArray[0]}
            </div>
            <div style={{ width: "90%" }}>
                <h1 style={{ float: "left", fontSize: "20px" }}>Permisos</h1>
                {childrenArray[1]}
                {childrenArray[2]}
            </div>
            <SubmitButton />
        </form>
    )
}


const SubmitButton = () => {
    return (
        <div style={{ width: "90%", paddingTop: "20px" }}>
            <Button type="submit" className='submit-button' style={{ float: "left" }}>
                Guardar rol
            </Button>
        </div>
    )
}