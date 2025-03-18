import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, JSX, useRef } from 'react';
import {
    TextField, Button, TableContainer, TableHead, TableRow, Paper, Table, TableCell, TableBody
} from "@mui/material";
import "../styles/form.css";
import "../styles/permissions.css";
import { Person, Visibility } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { AccessPermission, RoleApi } from '../api/role_api';
import Swal from 'sweetalert2';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CreateIcon from '@mui/icons-material/Create';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { CalendarMonth } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';
import { PermissionVerifier } from '../api/verifyPermissions';

interface Acceso { icon: JSX.Element; permissions: string[]; }
interface PermissionInfo { icon: JSX.Element; className: string; }
export const accesos: { [key: string]: Acceso } = {
    Citas: { icon: <CalendarMonth />, permissions: ["Visualizar", "Crear", "Editar"] },
    Usuarios: { icon: <Person />, permissions: ["Visualizar", "Crear", "Editar"] },
    Servicios: { icon: <StorefrontIcon/>, permissions: ["Visualizar", "Crear", "Editar", "Eliminar"] },
    Productos: { icon: <BoxIcon />, permissions: ["Visualizar", "Crear", "Editar", "Eliminar"] },
    Roles: { icon: <ManageAccountsIcon />, permissions: ["Visualizar", "Crear", "Editar", "Eliminar"] },
    Notificaciones: { icon: <NotificationsIcon />, permissions: ["Visualizar", "Crear", "Editar"] },
    Chats: { icon: <ChatIcon />, permissions: ["Visualizar", "Crear"] },
    Pagos: { icon: <PaymentIcon />, permissions: ["Visualizar", "Crear"] },
}

export const permissionInfo: { [key: string]: PermissionInfo } = {
    Visualizar: { icon: <Visibility />, className: "view-permission" },
    Crear: { icon: <AddBoxIcon />, className: "create-permission" },
    Editar: { icon: <CreateIcon />, className: "edit-permission" },
    Eliminar: { icon: <DeleteIcon />, className: "delete-permission" },
}

export const permissionNames: { [key: string]: string } = {
    Visualizar: "READ",
    Crear: "CREATE",
    Editar: "EDIT",
    Eliminar: "DELETE",
}

export const CreateRole = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [roleNameError, setRoleNameError] = useState('');
    const [accessPermission, setAccessPermission] = useState<{ [key: string]: AccessPermission }>({});
    const [movilClass, setMovilClass] = useState('not-selected');
    const roleApi = new RoleApi();
    const permissionVerifier = new PermissionVerifier();

    useEffect(() => {
        const verifyPermissions = async () => {
            await verifyUserPermissions();
        }
        verifyPermissions();
        initAccessPermissions();
    }, [])

    const createRole = async () => {
        const request = getRoleData();
        const validPermissions = verifyPermissions(Object.values(request.accesses));
        if (!validPermissions) {
            showPermissionsNotSelectedMessage();
            return;
        }
        await roleApi.createRole(request);
        if (verifyErros()){return}
        showSuccessMessage();
    }

    const verifyUserPermissions = async () => {
        const permissions = await permissionVerifier.getRoleAccessPermissions();
        if (!permissions.create) {
            navigate('/');
        }
    }

    const verifyPermissions = (accesses: AccessPermission[]): boolean => {
        const numPermissions = accesses.reduce((acc, access) => acc + access.permissions.length, 0);
        return numPermissions > 0;
    }

    const verifyErros = (): boolean => {
        clearErrors();
        if (roleApi.isError('INVALID_ROLE_NAME')) {
            setRoleNameError(roleApi.getErrorMessage());
            return true;
        }
        if (roleApi.isError('ROLE_ALREADY_EXISTS')) {
            setRoleNameError(roleApi.getErrorMessage());
            return true;
        }
        return false;
    }

    const getRoleData = () => {
        const roleName = getValues('roleName');
        const accesses = Object.values(accessPermission).filter((access) => access.permissions.length > 0);

        return { name: roleName, accesses: accesses };
    }

    const showPermissionsNotSelectedMessage = () => {
        Swal.fire({
            title: 'Error',
            text: 'Debe seleccionar al menos un permiso',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }

    const showSuccessMessage = () => {
        Swal.fire({
            title: 'Rol creado',
            text: 'El rol se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(clearForm);
    }

    const clearErrors = () => {
        setRoleNameError('');
    }

    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        Object.keys(accesos).map((acceso) => {
            accesos[acceso].permissions.map((permission) => {
                desSelectButton(acceso, permission);
            })
        })
        setMovilClass('not-selected');
        initAccessPermissions();
    }

    const onClickPermission = (access: string, permission: string) => {
        const buttonId = `${access}-${permission}`;
        const button = document.getElementById(buttonId)?.querySelector("button");
        if (button?.classList.contains("not-selected")) {
            selectButton(access, permission);
            if (permission === "Editar" || permission === "Eliminar") {
                selectButton(access, "Visualizar");
            }
        } else {
            desSelectButton(access, permission);
            if (permission === "Visualizar") {
                desSelectButton(access, "Editar");
                desSelectButton(access, "Eliminar");
            }
        }
    }

    const selectButton = (access: string, permission: string) => {
        const buttonId = `${access}-${permission}`;
        const button = document.getElementById(buttonId)?.querySelector("button");
        if (button?.classList.contains("not-selected")) {
            button?.classList.remove("not-selected");
            button?.classList.add(permissionInfo[permission].className);
            accessPermission[access].permissions.push(permissionNames[permission]);
        }
    }

    const desSelectButton = (access: string, permission: string) => {
        const buttonId = `${access}-${permission}`;
        const button = document.getElementById(buttonId)?.querySelector("button");
        if (button?.classList.contains(permissionInfo[permission].className)) {
            button?.classList.remove(permissionInfo[permission].className);
            button?.classList.add("not-selected");
            accessPermission[access].permissions = accessPermission[access].permissions.filter((p) => p !== permissionNames[permission]);
        }
    }

    const actionOptions = (acceso: string) => {
        return accesos[acceso].permissions.map((permission) => (
            <div id={`${acceso}-${permission}`} key={`${acceso}-${permission}`} style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "10px" }}>
                <Button className="not-selected" style={{ gap: "5px" }}
                    onClick={() => onClickPermission(acceso, permission)}>
                    {permission}
                    {permissionInfo[permission].icon}
                </Button>
            </div>
        ))
    }

    const selectMovilPermissions = () => {
        if (movilClass === 'movil-permission') {
            setMovilClass('not-selected');
            accessPermission['Movil'].permissions = [];
        }
        else {
            setMovilClass('movil-permission');
            accessPermission['Movil'].permissions.push('READ');
        }
    }

    const initAccessPermissions = () => {
        const access: { [key: string]: AccessPermission } = {};
        Object.keys(accesos).forEach((acceso) => {
            access[acceso] = { access: acceso.toUpperCase(), permissions: [] };
        })
        access['Movil'] = { access: 'MOVIL', permissions: [] };
        setAccessPermission(access);
    }

    return (
        <div>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                onSubmit={handleSubmit(createRole)} ref={formRef}>
                <div style={{ width: "90%" }}>
                    <TextField
                        label="Nombre del rol"
                        variant="outlined"
                        margin="normal"
                        {...register('roleName', { required: 'El nombre del rol es obligatorio' })}
                        error={!!errors.roleName || !!(roleNameError.length > 0)}
                        helperText={roleNameError}
                        style={{ width: "50%" }}
                    />
                </div>
                <div style={{ width: "90%"}}>
                    <h1 style={{ float: "left", fontSize: "20px"}}>Permisos</h1>
                    <Button style={{ float: "right", marginTop: "10px" }} className={movilClass}
                        onClick={() => selectMovilPermissions()}>
                        Aplicativo móvil
                        <SmartphoneIcon />
                    </Button>
                    
                    <TableContainer component={Paper} style={{ width: "100%", margin: "auto" }}>
                        <Table>
                            <TableHead style={{ backgroundColor: "#37474F" }}>
                                <TableRow>
                                    <TableCell style={{ width: "50%" }} className="header">
                                        Acceso
                                    </TableCell>
                                    <TableCell className="header" style={{ width: "50%" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(accesos).map((acceso) => (
                                    <TableRow key={acceso}>
                                        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                {accesos[acceso].icon}
                                                {acceso}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {actionOptions(acceso)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div style={{ width: "90%", paddingTop: "20px" }}>
                    <Button type="submit" className='submit-button' style={{ float: "left" }}>
                        Guardar rol
                    </Button>
                </div>
            </form>
        </div>
    )
}