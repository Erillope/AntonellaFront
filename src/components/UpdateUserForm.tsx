import { Button } from '@mui/material';
import React from 'react';
import "../styles/form.css"

interface UpdateUserFormProps {
    handleSubmit: () => () => void;
    formRef?: React.Ref<HTMLFormElement>;
    editable: boolean;
    discartChanges: () => void;
    children: React.ReactNode;
}

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ handleSubmit, formRef,
    editable, discartChanges, children }) => {
    return (
        <form className='form-control' ref={formRef}
            onSubmit={handleSubmit()}>
            {children}
            <FormButtons editable={editable} discartChanges={discartChanges} />
        </form>
    )
}


const FormButtons: React.FC<{editable: boolean, discartChanges: () => void}> = ({editable, discartChanges}) => {
    return (
        <div className='buttons-box'>
            {editable &&
                <div className='buttons-group'>
                    <Button type="submit" className='submit-button'>Guardar Cambios</Button>
                    <Button className='submit-button2' onClick={discartChanges}>Descartar Cambios</Button>
                </div>
            }
        </div>
    )
}