import { useState, useEffect } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { ExpandLess, ExpandMore, Person } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import "../styles/sideBar.css";
import { PermissionVerifier, Permissions } from "../api/verifyPermissions";

export const SideBar = () => {
    const [principalClass, setPrincipalClass] = useState("menuOpen");
    const [usuariosClass, setUsuariosClass] = useState("menuClose");
    const [usuarioMenuOpen, setUsuarioMenuOpen] = useState(false);
    const [userIconColor, setUserIconColor] = useState("#37474F");

    const [rolesClass, setRolesClass] = useState("menuClose");
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [roleIconColor, setRoleIconColor] = useState("#37474F");

    const permissionVerifier = new PermissionVerifier();
    const [userAccessPermissions, setUserAccessPermissions] = useState<Permissions>({empty: true, read: false, create: false, edit: false, delete: false});
    const [roleAccessPermissions, setRoleAccessPermissions] = useState<Permissions>({empty: true, read: false, create: false, edit: false, delete: false});

    useEffect(() => {
        const fetchPermissions = async () => {
            const userAccessPermissions = await permissionVerifier.getUserAccessPermissions();
            const roleAccessPermissions = await permissionVerifier.getRoleAccessPermissions();
            setUserAccessPermissions(userAccessPermissions);
            setRoleAccessPermissions(roleAccessPermissions);
        }
        fetchPermissions();
    }, [])

    const onClickPrincipal = () => {
        closeAll();
        setPrincipalClass("menuOpen");
    }

    const onClickUsuarios = () => {
        closeAll();
        setUsuariosClass("menuOpen");
        setUsuarioMenuOpen(!usuarioMenuOpen);
        setUserIconColor("white");
    }

    const onClickRoles = () => {
        closeAll();
        setRolesClass("menuOpen");
        setRoleMenuOpen(!roleMenuOpen);
        setRoleIconColor("white");
    }

    const closeAll = () => {
        setPrincipalClass("menuClose");
        setUsuariosClass("menuClose");
        setUsuarioMenuOpen(false);
        setUserIconColor("#37474F");
        setRolesClass("menuClose");
        setRoleMenuOpen(false);
        setRoleIconColor("#37474F");
    }

    return (
        <div style={{ width: 250, height: "100%", backgroundColor: 'white' }}>
            <List sx={{ width: 250, bgcolor: "white", color: "#37474F" }}>
                <ListItemButton className={principalClass} onClick={onClickPrincipal}
                    component={Link} to="/">
                    <ListItemText primary="Principal" />
                </ListItemButton>
                {!userAccessPermissions.empty &&
                    <ListItemButton onClick={onClickUsuarios} className={usuariosClass}>
                        <ListItemIcon>
                            <Person style={{ color: userIconColor }} />
                        </ListItemIcon>
                        <ListItemText primary="Usuarios" />
                        {usuarioMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }

                <Collapse in={usuarioMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: "#EBEDEE" }}>
                        {userAccessPermissions.create &&
                            <ListItemButton component={Link} to="/user/create/">
                                <ListItemText primary="Crear" />
                            </ListItemButton>
                        }
                        {userAccessPermissions.read &&
                            <ListItemButton component={Link} to="/user/search/">
                                <ListItemText primary="Consultar" />
                            </ListItemButton>
                        }

                    </List>
                </Collapse>
                {!roleAccessPermissions.empty &&
                    <ListItemButton onClick={onClickRoles} className={rolesClass}>
                        <ListItemIcon>
                            <ManageAccountsIcon style={{ color: roleIconColor }} />
                        </ListItemIcon>
                        <ListItemText primary="Roles" />
                        {roleMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }

                <Collapse in={roleMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: "#EBEDEE" }}>
                        {roleAccessPermissions.create &&
                            <ListItemButton component={Link} to="/role/create/">
                                <ListItemText primary="Crear" />
                            </ListItemButton>
                        }
                        {roleAccessPermissions.read &&
                            <ListItemButton component={Link} to="/role/search/">
                                <ListItemText primary="Consultar" />
                            </ListItemButton>
                        }
                    </List>
                </Collapse>

            </List>
        </div>
    );
}