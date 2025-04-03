import React from "react";
import "../styles/form.css"
import { Button } from "@mui/material";

interface EditServiceFormProps {
    formRef?: React.Ref<HTMLFormElement>;
    handleSubmit?: () => () => void;
    children: React.ReactNode;
    toForm?: () => void;
    discart?: () => void;
    del?: () => void;
    editable?: boolean;
}

export const EditServiceForm: React.FC<EditServiceFormProps> = ({ formRef, handleSubmit, children, toForm, discart, del, editable=true }) => {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", width: '100%',
            overflowY: 'auto'
        }}>
            <form ref={formRef} onSubmit={handleSubmit?.()} style={{ width: '100%' }}>
                <div style={{ width: "90%" }}>
                    {children}
                </div>
                <FormButton toForm={toForm ? toForm : () => { }} />
                {editable && (
                    <>
                        <DiscartButton discart={discart} />
                        <SubmitButton />
                        <DeleteButton del={del} />
                    </>
                )}
            </form>
        </div>
    )
}


const FormButton: React.FC<{ toForm: () => void }> = ({ toForm }) => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button style={{ backgroundColor: '#C9285D', color: 'white' }}
                onClick={toForm}>Formulario</Button>
        </div>
    )
}

const SubmitButton = () => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button className="submit-button" type="submit">Guardar</Button>
        </div>
    )
}

const DiscartButton: React.FC<{ discart?: () => void }> = ({ discart }) => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button className="submit-button2"
                onClick={() => discart?.()}>Descartar Cambios</Button>
        </div>
    )
}

const DeleteButton: React.FC<{ del?: () => void }> = ({ del }) => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button className="delete"
                onClick={() => del?.()}>Eliminar</Button>
        </div>
    )
}