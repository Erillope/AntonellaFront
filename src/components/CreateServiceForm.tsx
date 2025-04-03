import React from "react";
import "../styles/form.css"
import { Button } from "@mui/material";

interface CreateServiceFormProps {
    formRef?: React.Ref<HTMLFormElement>;
    handleSubmit?: () => () => void;
    children: React.ReactNode;
}

export const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ formRef, handleSubmit, children }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%',
            overflowY: 'auto'}}>
            <form ref={formRef} onSubmit={handleSubmit?.()} style={{width: '100%'}}>
                <div style={{ width: "90%" }}>
                    {children}
                </div>
                <FormButton />
            </form>
        </div>
    )
}


const FormButton = () => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button style={{ backgroundColor: '#C9285D', color: 'white' }} type="submit">Formulario</Button>
        </div>
    )
}