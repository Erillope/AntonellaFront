import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../styles/permissions.css";
import { Visibility } from "@mui/icons-material";
import CreateIcon from '@mui/icons-material/Create';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

export interface SelectPermissionsProps {
    availablePermissions?: string[];
    selectedPermissions?: string[];
    onSelectPermissions?: (permissions: string[]) => void;
}

export const SelectPermissions: React.FC<SelectPermissionsProps> = ({ availablePermissions,
    onSelectPermissions, selectedPermissions }) => {
    const defaultPermissions = ["READ", "CREATE", "EDIT", "DELETE"];
    const [readClass, setReadClass] = useState("not-selected");
    const [createClass, setCreateClass] = useState("not-selected");
    const [editClass, setEditClass] = useState("not-selected");
    const [deleteClass, setDeleteClass] = useState("not-selected");

    const init = () => {
        if (selectedPermissions && selectedPermissions.length > 0) {
            if (selectedPermissions.includes("READ")) { setReadClass("view-permission"); }
            else { deselectRead(new Set(selectedPermissions)); }
            if (selectedPermissions.includes("CREATE")) { setCreateClass("create-permission"); }
            else { deselectCreate(new Set(selectedPermissions)); }
            if (selectedPermissions.includes("EDIT")) { setEditClass("edit-permission"); }
            else { deselectEdit(new Set(selectedPermissions)); }
            if (selectedPermissions.includes("DELETE")) { setDeleteClass("delete-permission"); }
            else { deselectDelete(new Set(selectedPermissions)); }
        }
        else {
            setReadClass("not-selected");
            setCreateClass("not-selected");
            setEditClass("not-selected");
            setDeleteClass("not-selected");
        }

    }

    useEffect(init, [selectedPermissions]);

    const getPermissions = () => {
        return availablePermissions ? availablePermissions : defaultPermissions
    }

    const read = (permissions: Set<string>) => {
        if (readClass === "view-permission") {
            deselectRead(permissions);
            if (permissions.has("EDIT")) { deselectEdit(permissions); }
            if (permissions.has("DELETE")) { deselectDelete(permissions); }
        }
        else { selectRead(permissions); }
        onSelectPermissions && onSelectPermissions(Array.from(permissions));
    }

    const create = (permissions: Set<string>) => {
        if (createClass === "create-permission") { deselectCreate(permissions); }
        else { selectCreate(permissions); }
        onSelectPermissions && onSelectPermissions(Array.from(permissions));
    }

    const edit = (permissions: Set<string>) => {
        if (editClass === "edit-permission") { deselectEdit(permissions);}
        else { 
            selectEdit(permissions);
            if (!permissions.has("READ")) { selectRead(permissions); }
        }
        onSelectPermissions && onSelectPermissions(Array.from(permissions));
    }

    const del = (permissions: Set<string>) => {
        if (deleteClass === "delete-permission") { deselectDelete(permissions); }
        else {
            selectDelete(permissions);
            if (!permissions.has("READ")) { selectRead(permissions); }
        }
        onSelectPermissions && onSelectPermissions(Array.from(permissions));
    }

    const selectRead = (permissions: Set<string>) => {
        permissions.add("READ");
        setReadClass("view-permission");
    }

    const deselectRead = (permissions: Set<string>) => {
        permissions.delete("READ");
        setReadClass("not-selected");
    }

    const selectCreate = (permissions: Set<string>) => {
        permissions.add("CREATE");
        setCreateClass("create-permission");
    }

    const deselectCreate = (permissions: Set<string>) => {
        permissions.delete("CREATE");
        setCreateClass("not-selected");
    }

    const selectEdit = (permissions: Set<string>) => {
        permissions.add("EDIT");
        setEditClass("edit-permission");
    }

    const deselectEdit = (permissions: Set<string>) => {
        permissions.delete("EDIT");
        setEditClass("not-selected");
    }

    const selectDelete = (permissions: Set<string>) => {
        permissions.add("DELETE");
        setDeleteClass("delete-permission");
    }

    const deselectDelete = (permissions: Set<string>) => {
        permissions.delete("DELETE");
        setDeleteClass("not-selected");
    }

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {getPermissions().includes("READ") &&
                <PermissionButton permission="Visualizar" className={readClass} icon={<Visibility />}
                    onClick={() => read(new Set(selectedPermissions))} />
            }
            {getPermissions().includes("CREATE") &&
                <PermissionButton permission="Crear" className={createClass} icon={<AddBoxIcon />}
                    onClick={() => create(new Set(selectedPermissions))} />
            }
            {getPermissions().includes("EDIT") &&
                <PermissionButton permission="Editar" className={editClass} icon={<CreateIcon />}
                    onClick={() => edit(new Set(selectedPermissions))} />
            }
            {getPermissions().includes("DELETE") &&
                <PermissionButton permission="Eliminar" className={deleteClass} icon={<DeleteIcon />}
                    onClick={() => del(new Set(selectedPermissions))} />
            }
        </div>
    )
}


interface MovilPermissionProps {
    onSelectMovilPermissions?: (permissions: string[]) => void;
    value?: string[];
}

export const MovilPermission: React.FC<MovilPermissionProps> = ({ onSelectMovilPermissions, value }) => {
    const [movilClass, setMovilClass] = useState("not-selected");
    const allPermissions = ["READ", "CREATE", "EDIT", "DELETE"];

    useEffect(() => {
        if (!!value && value.length > 0) {
            setMovilClass('movil-permission');
        }
        else {
            setMovilClass('not-selected');
        }
    }, [value]);

    const selectMovilPermissions = () => {
        if (movilClass === 'movil-permission') {
            setMovilClass('not-selected');
            onSelectMovilPermissions && onSelectMovilPermissions([]);
        }
        else {
            setMovilClass('movil-permission');
            onSelectMovilPermissions && onSelectMovilPermissions(allPermissions);
        }
    }

    return (
        <Button style={{ float: "right", marginTop: "10px" }} className={movilClass}
            onClick={() => selectMovilPermissions()}>
            Aplicativo móvil
            <SmartphoneIcon />
        </Button>
    )
}

interface PermissionButtonProps {
    permission: string;
    onClick: () => void;
    className: string;
    icon: React.ReactNode;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({ permission, onClick, className, icon }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "10px" }}>
            <Button className={className} style={{ gap: "5px" }}
                onClick={onClick}>
                {permission}
                {icon}
            </Button>
        </div>
    )
}