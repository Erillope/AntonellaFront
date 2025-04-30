import { Box, Button } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import "../../styles/permissions.css";
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { useState } from "react";
import { AccessPermission } from "../../api/role_api";

export interface SelectPermissionsProps {
    permissions?: string[];
    disabled?: boolean;
    onClickRead?: () => void;
    onClickCreate?: () => void;
    onClickEdit?: () => void;
    onClickDelete?: () => void;
}

export const SelectPermissions = (props: SelectPermissionsProps) => {
    return (
        <Box display='flex' flexDirection='row' gap={2} width='100%' justifyContent='center'>
            <Button className={props.permissions?.includes("READ") ? "view-permission" : "not-selected"}
                disabled={props.disabled} onClick={props.onClickRead} sx={{ paddingRight: 2, paddingLeft: 2}}>
                Visualizar
                <Visibility />
            </Button>
            <Button className={props.permissions?.includes("CREATE") ? "create-permission" : "not-selected"}
                disabled={props.disabled} onClick={props.onClickCreate} sx={{ paddingRight: 2, paddingLeft: 2}}>
                Crear
                <AddBoxIcon />
            </Button>
            <Button className={props.permissions?.includes("EDIT") ? "edit-permission" : "not-selected"}
                disabled={props.disabled} onClick={props.onClickEdit} sx={{ paddingRight: 2, paddingLeft: 2}}>
                Editar
                <CreateIcon />
            </Button>
            <Button className={props.permissions?.includes("DELETE") ? "delete-permission" : "not-selected"}
                disabled={props.disabled} onClick={props.onClickDelete} sx={{ paddingRight: 2, paddingLeft: 2}}>
                Eliminar
                <DeleteIcon />
            </Button>
        </Box>
    )
}

interface MovilPermissionProps {
    permissions?: string[];
    disabled?: boolean;
    onClick?: () => void;
}

export const MovilPermission = (props: MovilPermissionProps) => {
    const active = (props.permissions?.length ?? 0) > 0
    return (
        <Button className={active ? 'movil-permission' : 'not-selected'}
            disabled={props.disabled} onClick={props.onClick}>
            Aplicativo Móvil
            <SmartphoneIcon />
        </Button>
    )
}

export const useSelectPermissions = () => {
    const [permissions, setPermissions] = useState<string[]>([]);

    const onClickRead = () => {
        if (permissions.includes("READ")) {
            setPermissions(permissions.filter(permission => permission !== "READ" && permission !== "EDIT" && permission !== "DELETE"));
        } else {
            setPermissions([...permissions, "READ"]);
        }
    }

    const onClickCreate = () => {
        if (permissions.includes("CREATE")) {
            setPermissions(permissions.filter(permission => permission !== "CREATE"));
        } else {
            setPermissions([...permissions, "CREATE"]);
        }
    }

    const onClickEdit = () => {
        if (permissions.includes("EDIT")) {
            setPermissions(permissions.filter(permission => permission !== "EDIT"));
        } else {
            setPermissions([...permissions, "EDIT"]);
            if (!permissions.includes('READ')) {
                setPermissions([...permissions, 'READ', 'EDIT']);
            }
        }
    }

    const onClickDelete = () => {
        if (permissions.includes("DELETE")) {
            setPermissions(permissions.filter(permission => permission !== "DELETE"));
        } else {
            setPermissions([...permissions, "DELETE"]);
            if (!permissions.includes('READ')) {
                setPermissions([...permissions, 'READ', 'DELETE']);
            }
        }
    }

    const clearInput = () => setPermissions([]);

    const getProps = (): SelectPermissionsProps => {
        return {
            permissions: permissions,
            onClickCreate,
            onClickDelete,
            onClickEdit,
            onClickRead,
        }
    }

    return {
        getProps,
        setPermissions,
        permissions,
        clearInput
    }
}


export const usePermissions = () => {
    const citasPermissions = useSelectPermissions();
    const usuariosPermissions = useSelectPermissions();
    const serviciosPermissions = useSelectPermissions();
    const productosPermissions = useSelectPermissions();
    const rolesPermissions = useSelectPermissions();
    const notificacionesPermissions = useSelectPermissions();
    const chatsPermissions = useSelectPermissions();
    const pagosPermissions = useSelectPermissions();

    const getProps = (): { [key: string]: SelectPermissionsProps } => {
        return {
            citas: citasPermissions.getProps(),
            usuarios: usuariosPermissions.getProps(),
            servicios: serviciosPermissions.getProps(),
            productos: productosPermissions.getProps(),
            roles: rolesPermissions.getProps(),
            notificaciones: notificacionesPermissions.getProps(),
            chats: chatsPermissions.getProps(),
            pagos: pagosPermissions.getProps(),
        }
    }

    const getData = (): AccessPermission[] => {
        const data = [
            {
                access: 'CITAS',
                permissions: citasPermissions.permissions
            },
            {
                access: 'USUARIOS',
                permissions: usuariosPermissions.permissions
            },
            {
                access: 'SERVICIOS',
                permissions: serviciosPermissions.permissions
            },
            {
                access: 'PRODUCTOS',
                permissions: productosPermissions.permissions
            },
            {
                access: 'ROLES',
                permissions: rolesPermissions.permissions
            },
            {
                access: 'NOTIFICACIONES',
                permissions: notificacionesPermissions.permissions
            },
            {
                access: 'CHATS',
                permissions: chatsPermissions.permissions
            },
            {
                access: 'PAGOS',
                permissions: pagosPermissions.permissions
            }
        ]
        return data.filter(permission => permission.permissions.length > 0);
    }

    const setFromAccessPermissions = (accesses: AccessPermission[]) => {
        clearInputs()
        accesses.forEach(access => {
            switch (access.access) {
                case 'CITAS':
                    citasPermissions.setPermissions(access.permissions);
                    break;
                case 'USUARIOS':
                    usuariosPermissions.setPermissions(access.permissions);
                    break;
                case 'SERVICIOS':
                    serviciosPermissions.setPermissions(access.permissions);
                    break;
                case 'PRODUCTOS':
                    productosPermissions.setPermissions(access.permissions);
                    break;
                case 'ROLES':
                    rolesPermissions.setPermissions(access.permissions);
                    break;
                case 'NOTIFICACIONES':
                    notificacionesPermissions.setPermissions(access.permissions);
                    break;
                case 'CHATS':
                    chatsPermissions.setPermissions(access.permissions);
                    break;
                case 'PAGOS':
                    pagosPermissions.setPermissions(access.permissions);
                    break;
            }
        })
    }

    const clearInputs = () => {
        citasPermissions.clearInput()
        usuariosPermissions.clearInput()
        serviciosPermissions.clearInput()
        productosPermissions.clearInput()
        rolesPermissions.clearInput()
        notificacionesPermissions.clearInput()
        chatsPermissions.clearInput()
        pagosPermissions.clearInput()
    }

    return {
        getProps,
        getData,
        clearInputs,
        setFromAccessPermissions
    }
}


export const useMovilPermissions = () => {
    const [permissions, setPermissions] = useState<string[]>([]);

    const onClick = () => {
        if (permissions.length > 0) {
            setPermissions([]);
        } else {
            setPermissions(["READ", 'CREATE', 'EDIT', 'DELETE']);
        }
    }

    const getProps = (): MovilPermissionProps => {
        return {
            permissions: permissions,
            onClick,
        }
    }

    const clearInput = () => setPermissions([]);
    const clearError = () => setPermissions([]);

    return {
        getProps,
        setPermissions,
        permissions,
        clearInput,
        clearError
    }
}