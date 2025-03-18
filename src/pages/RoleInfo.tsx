import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
    TextField, Button, TableContainer, TableHead, TableRow, Paper, Table, TableCell, TableBody
} from "@mui/material";
import "../styles/form.css";
import "../styles/permissions.css";
import { AccessPermission, RoleApi, Role } from '../api/role_api';
import Swal from 'sweetalert2';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { permissionNames, permissionInfo, accesos } from './CreateRole';
import { PermissionVerifier } from '../api/verifyPermissions';

const _permissionNames: { [key: string]: string } = {
    "READ": "Visualizar",
    "CREATE": "Crear",
    "EDIT": "Editar",
    "DELETE": "Eliminar"
}

const _accessesNames: { [key: string]: string } = {
    "CITAS": "Citas",
    "USUARIOS": "Usuarios",
    "SERVICIOS": "Servicios",
    "PRODUCTOS": "Productos",
    "ROLES": "Roles",
    "NOTIFICACIONES": "Notificaciones",
    "CHATS": "Chats",
    "PAGOS": "Pagos",
    "MOVIL": "Movil"
}

export const RoleInfo = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const { roleId } = useParams();
    const { handleSubmit } = useForm();
    const [roleNameError, setRoleNameError] = useState('');
    const [accessPermission, setAccessPermission] = useState<{ [key: string]: AccessPermission }>({});
    const [movilClass, setMovilClass] = useState('not-selected');
    const roleApi = new RoleApi();
    const permissionVerifier = new PermissionVerifier();
    const [role, setRole] = useState<Role>();
    const [name, setName] = useState('');
    const [editable, setEditable] = useState(false);
    const [deletePermission, setDeletePermission] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            const role = await roleApi.getRole(roleId ?? '');
            await verifyUserPermissions(role);
            if (roleApi.isError('ROLE_NOT_FOUND')) {
                navigate('/role/search');
            }
            if (role) {
                setRole(role);
            }
        }
        fetchRole();
    }, [])

    useEffect(() => {
        if (role) {
            discartChanges();
        }
    }, [role])

    const updateRole = async () => {
        const request = getRoleData();
        const validPermissions = verifyPermissions(Object.values(request.accesses));
        if (!validPermissions) {
            showPermissionsNotSelectedMessage();
            return;
        }
        const updatedRole = await roleApi.updateRole({ role: role?.name ?? '', name: request.name, accesses: request.accesses });
        if (verifyErros()) { return }
        setRole(updatedRole);
        showSuccessMessage();
    }

    const verifyUserPermissions = async (selectedRole: Role | undefined) => {
        const permissions = await permissionVerifier.getRoleAccessPermissions();
        if (!permissions.read) {
            navigate('/');
        }
        if (!!(selectedRole?.name === "super_admin")) {
            setEditable(false);
            setDeletePermission(false);
        }
        else {
            setEditable(permissions.edit)
            setDeletePermission(permissions.delete)
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
        const roleName = name;
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
            title: 'Rol actualizado',
            text: 'El rol se ha sido actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    const clearErrors = () => {
        setRoleNameError('');
    }

    const onClickPermission = (access: string, permission: string) => {
        const buttonId = `${access}-${permission}`;
        const button = document.getElementById(buttonId)?.querySelector("button");
        if (button?.classList.contains("not-selected")) {
            selectButton(access, permission, accessPermission);
            if (permission === "Editar" || permission === "Eliminar") {
                selectButton(access, "Visualizar", accessPermission);
            }
        } else {
            desSelectButton(access, permission, accessPermission);
            if (permission === "Visualizar") {
                desSelectButton(access, "Editar", accessPermission);
                desSelectButton(access, "Eliminar", accessPermission);
            }
        }
    }

    const selectButton = (access: string, permission: string, accessPermission: any) => {
        const buttonId = `${access}-${permission}`;
        const button = document.getElementById(buttonId)?.querySelector("button");
        if (button?.classList.contains("not-selected")) {
            button?.classList.remove("not-selected");
            button?.classList.add(permissionInfo[permission].className);
        }
        if (!accessPermission[access].permissions.includes(permissionNames[permission])) {
            accessPermission[access].permissions.push(permissionNames[permission]);
        }
    }

    const desSelectButton = (access: string, permission: string, accessPermission: { [key: string]: AccessPermission }) => {
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
                    onClick={() => onClickPermission(acceso, permission)} disabled={!editable}>
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

    const initData = (role: Role, accessPermission: any) => {
        setName(role.name);
        role.accesses.forEach((access) => {
            access.permissions.forEach((permission) => {
                selectButton(_accessesNames[access.access], _permissionNames[permission], accessPermission);
            })
        })
        role.accesses.forEach((access) => {
            if (access.access === 'MOVIL') {
                setMovilClass('movil-permission');
                return;
            }
        })
    }

    const initAccessPermissions = (): { [key: string]: AccessPermission } => {
        const access: { [key: string]: AccessPermission } = {};
        Object.keys(accesos).forEach((acceso) => {
            access[acceso] = { access: acceso.toUpperCase(), permissions: [] };
        })
        access['Movil'] = { access: 'MOVIL', permissions: [] };
        return access;
    }

    const discartChanges = () => {
        setName(role?.name ?? '');
        const updateAccessPermission = initAccessPermissions();
        clearButtons();
        if (role) {
            initData(role, updateAccessPermission);
        }
        setAccessPermission(updateAccessPermission);
    }

    const clearButtons = () => {
        Object.values(_accessesNames).forEach((access) => {
            Object.values(_permissionNames).forEach((permission) => {
                desSelectButton(access, permission, accessPermission);
            })
        })
        setMovilClass('not-selected');
    }

    const deleteRole = () => {
        roleApi.deleteRole(role?.name ?? '');
        roleDeletedMessage(role?.name ?? '');
        navigate('/role/search');
    }

    const confirmDeleteRole = () => {
        Swal.fire({
            title: 'Eliminar Rol',
            text: '¿Está seguro que desea eliminar el rol? También se removerá de la lista de roles de los usuarios',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRole();
        }})
    }

    const roleDeletedMessage = (roleName: string) => {
        Swal.fire({
            title: 'Rol eliminado',
            text: `El rol ${roleName} ha sido eliminado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })
    }

    return (
        <div>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                onSubmit={handleSubmit(updateRole)} ref={formRef}>
                <div style={{ width: "90%" }}>
                    <TextField
                        label="Nombre del rol"
                        variant="outlined"
                        disabled={!editable}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        error={name.length == 0 || !!(roleNameError.length > 0)}
                        helperText={name.length == 0 ? "El celular es obligatorio" : roleNameError}
                        style={{ width: "50%" }}
                    />
                </div>
                <div style={{ width: "90%" }}>
                    <h1 style={{ float: "left", fontSize: "20px" }}>Permisos</h1>
                    <Button style={{ float: "right", marginTop: "10px" }} className={movilClass}
                        onClick={() => selectMovilPermissions()} disabled={!editable}>
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
                {editable &&
                    <div style={{ width: '90%', display: "flex", justifyContent: "flex-start", gap: "30px", paddingTop: "20px" }}>
                        <Button type="submit" className='submit-button'>Guardar Cambios</Button>
                        <Button className='submit-button2' onClick={discartChanges}>Descartar Cambios</Button>
                        {deletePermission &&
                            <Button className='delete' onClick={confirmDeleteRole}>Eliminar Rol</Button>
                        }
                    </div>
                }
            </form>
        </div>
    )
}