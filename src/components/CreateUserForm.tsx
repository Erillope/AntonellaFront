import { Button } from '@mui/material';
import React from 'react';
import "../styles/form.css"

interface CreateUserFormProps {
    formRef?: React.Ref<HTMLFormElement>;
    handleSubmit: () => () => void;
    children: React.ReactNode;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ formRef, handleSubmit, children }) => {
    return (
        <form className="form-control" ref={formRef}
            onSubmit={handleSubmit()}>
            <div className='input-group'>
                {children}
            </div>
            <SubmitButton />
        </form>
    )
}


const SubmitButton = () => {
    return (
        <div style={{ width: '50%', display: "flex", justifyContent: "center" }}>
            <div style={{ width: "80%", justifyContent: "flex-start", display: "flex" }}>
                <Button type="submit" className='submit-button'>Guardar Usuario</Button>
            </div>
        </div>
    )
}