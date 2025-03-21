import { Button } from "@mui/material";
import React from "react";

interface UpdateRoleFormProps {
    handleSubmit: () => () => void;
    formRef: any;
    children?: React.ReactNode;
    deletePermission: boolean;
    discartChanges: () => void;
    confirmDeleteRole: () => void;
    editable: boolean;
}

export const UpdateRoleForm: React.FC<UpdateRoleFormProps> = ({ handleSubmit, formRef, children,
    deletePermission, discartChanges, confirmDeleteRole, editable } 
) => {
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
            {editable &&
                <SubmitButton deletePermission={deletePermission} discartChanges={discartChanges} confirmDeleteRole={confirmDeleteRole} />
            }
        </form>
    )
}

interface SubmitButtonProps {
    deletePermission: boolean;
    discartChanges: () => void;
    confirmDeleteRole: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({deletePermission, discartChanges, confirmDeleteRole}) => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start", gap: "30px", paddingTop: "20px" }}>
            <Button type="submit" className='submit-button'>Guardar Cambios</Button>
            <Button className='submit-button2' onClick={discartChanges}>Descartar Cambios</Button>
            {deletePermission &&
                <Button className='delete' onClick={confirmDeleteRole}>Eliminar Rol</Button>
            }
        </div>
    )
}