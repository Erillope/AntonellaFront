import { useState, useEffect, JSX } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { ExpandLess, ExpandMore, Person } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import "../styles/sideBar.css";
import { PermissionVerifier, Permissions } from "../api/verifyPermissions";
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';

export const SideBar = () => {
    const sideBarController = useSideBar()

    return (
        <List sx={{ width: 250, bgcolor: "white", color: "#37474F", borderRadius: 5 }}>
            <ListItemButton className={sideBarController.pricipalMenuProps.className}
                onClick={sideBarController.pricipalMenuProps.onClick}
                component={Link} to={sideBarController.pricipalMenuProps.to}
                sx={{ borderRadius: 2}}>
                <ListItemText primary="Principal" />
            </ListItemButton>
            <MenuBar {...sideBarController.usuarioMenuProps} />
            <MenuBar {...sideBarController.roleMenuProps} />
            <MenuBar {...sideBarController.serviceMenuProps} />
            <MenuBar {...sideBarController.productoMenuProps} />
        </List>
    );
}

interface MenuBarProps {
    name: string;
    accessPermissions: Permissions;
    icon: JSX.Element;
    menuClass: string;
    menuOpen: boolean;
    onClick: () => void;
    to: {
        create: string;
        search: string;
    };
    crearMenuClass?: string;
    searchMenuClass?: string;
    onClickCrear?: () => void;
    onClickSearch?: () => void;
}

function MenuBar<Variant extends MenuBarProps>(props: Variant) {
    return (
        <>
            {
                !props.accessPermissions.empty &&
                <ListItemButton onClick={props.onClick} className={props.menuClass}>
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText primary={props.name}/>
                    {props.menuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            }

            <Collapse in={props.menuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {props.accessPermissions.create &&
                        <ListItemButton component={Link} to={props.to.create} className={props.crearMenuClass}
                            onClick={props.onClickCrear}>
                            <ListItemText primary="Crear" />
                        </ListItemButton>
                    }
                    {props.accessPermissions.read &&
                        <ListItemButton component={Link} to={props.to.search} className={props.searchMenuClass}
                            onClick={props.onClickSearch}>
                            <ListItemText primary="Consultar" />
                        </ListItemButton>
                    }
                </List>
            </Collapse>
        </>
    )
}

const useMenuBar = () => {
    const [accessPermissions, setAccessPermissions] = useState<Permissions>({ empty: true, read: false, create: false, edit: false, delete: false });
    const [menuClass, setmenuClass] = useState("menuClose");
    const [menuOpen, setMenuOpen] = useState(false);
    const [iconColor, setIconColor] = useState("black");
    const [crearMenuClass, setCrearMenuClass] = useState("subMenuClosed");
    const [searchMenuClass, setSearchMenuClass] = useState("subMenuClosed");

    const onClickCrear = () => {
        setCrearMenuClass(crearMenuClass === "subMenuClosed" ? "subMenuOpen" : "subMenuClosed");
        setSearchMenuClass("subMenuClosed");
    }

    const onClickSearch = () => {
        setSearchMenuClass(searchMenuClass === "subMenuClosed" ? "subMenuOpen" : "subMenuClosed");
        setCrearMenuClass("subMenuClosed");
    }

    const onClick = () => {
        setmenuClass("menuOpen");
        setMenuOpen(!menuOpen);
        setIconColor("white");
    }

    const close = () => {
        setmenuClass('menuClose')
        setMenuOpen(false)
        setIconColor('black')
    }

    const closeSubMenus = () => {
        setCrearMenuClass("subMenuClosed")
        setSearchMenuClass("subMenuClosed")
    }

    return {
        menuClass,
        menuOpen,
        iconColor,
        onClick,
        setmenuClass,
        setMenuOpen,
        setIconColor,
        close,
        accessPermissions,
        setAccessPermissions,
        onClickCrear,
        onClickSearch,
        crearMenuClass,
        searchMenuClass,
        closeSubMenus
    }
}

const useSideBar = () => {
    const permissionVerifier = new PermissionVerifier();
    const [principalClass, setPrincipalClass] = useState("menuOpen");
    const usuarioMenuController = useMenuBar()
    const roleMenuController = useMenuBar()
    const servicioMenuController = useMenuBar()
    const productoMenuController = useMenuBar()

    useEffect(() => {
        const fetchPermissions = async () => {
            const userAccessPermissions = await permissionVerifier.getUserAccessPermissions();
            const roleAccessPermissions = await permissionVerifier.getRoleAccessPermissions();
            const serviceAccessPermissions = await permissionVerifier.getServiceAccessPermissions();
            const productAccessPermissions = await permissionVerifier.getProductAccessPermissions();
            usuarioMenuController.setAccessPermissions(userAccessPermissions);
            roleMenuController.setAccessPermissions(roleAccessPermissions);
            servicioMenuController.setAccessPermissions(serviceAccessPermissions);
            productoMenuController.setAccessPermissions(productAccessPermissions);
        }
        fetchPermissions();
    }, [])

    const closeAll = () => {
        setPrincipalClass("menuClose");
        usuarioMenuController.close()
        roleMenuController.close()
        servicioMenuController.close()
        productoMenuController.close()
    }

    const closeAllSubMenus = () => {
        usuarioMenuController.closeSubMenus()
        roleMenuController.closeSubMenus()
        servicioMenuController.closeSubMenus()
        productoMenuController.closeSubMenus()
    }

    const onClickPrincipal = () => {
        closeAll();
        setPrincipalClass("menuOpen");
    }

    const getUsuarioMenuProps = (): MenuBarProps => {
        return {
            name: 'Usuarios',
            accessPermissions: usuarioMenuController.accessPermissions,
            icon: <Person style={{ color: usuarioMenuController.iconColor }} />,
            menuClass: usuarioMenuController.menuClass,
            menuOpen: usuarioMenuController.menuOpen,
            onClick: () => { closeAll(); usuarioMenuController.onClick() },
            crearMenuClass: usuarioMenuController.crearMenuClass,
            searchMenuClass: usuarioMenuController.searchMenuClass,
            onClickCrear: () => { closeAllSubMenus(); usuarioMenuController.onClickCrear() },
            onClickSearch: () => { closeAllSubMenus(); usuarioMenuController.onClickSearch() },
            to: {
                create: "/user/create/",
                search: "/user/search/"
            }
        }
    }

    const getRoleMenuProps = (): MenuBarProps => {
        return {
            name: 'Roles',
            accessPermissions: roleMenuController.accessPermissions,
            icon: <ManageAccountsIcon style={{ color: roleMenuController.iconColor }} />,
            menuClass: roleMenuController.menuClass,
            menuOpen: roleMenuController.menuOpen,
            crearMenuClass: roleMenuController.crearMenuClass,
            searchMenuClass: roleMenuController.searchMenuClass,
            onClickCrear: () => { closeAllSubMenus(); roleMenuController.onClickCrear() },
            onClickSearch: () => { closeAllSubMenus(); roleMenuController.onClickSearch() },
            onClick: () => { closeAll(); roleMenuController.onClick() },
            to: {
                create: "/role/create/",
                search: "/role/search/"
            }
        }
    }

    const getServiceMenuProps = (): MenuBarProps => {
        return {
            name: 'Servicios',
            accessPermissions: servicioMenuController.accessPermissions,
            icon: <StorefrontIcon style={{ color: servicioMenuController.iconColor }} />,
            menuClass: servicioMenuController.menuClass,
            menuOpen: servicioMenuController.menuOpen,
            crearMenuClass: servicioMenuController.crearMenuClass,
            searchMenuClass: servicioMenuController.searchMenuClass,
            onClickCrear: () => { closeAllSubMenus(); servicioMenuController.onClickCrear() },
            onClickSearch: () => { closeAllSubMenus(); servicioMenuController.onClickSearch() },
            onClick: () => { closeAll(); servicioMenuController.onClick() },
            to: {
                create: "/service/create/",
                search: "/service/search/"
            }
        }
    }

    const getProductMenuProps = (): MenuBarProps => {
        return {
            name: 'Productos',
            accessPermissions: productoMenuController.accessPermissions,
            icon: <BoxIcon style={{ color: productoMenuController.iconColor }} />,
            menuClass: productoMenuController.menuClass,
            menuOpen: productoMenuController.menuOpen,
            crearMenuClass: productoMenuController.crearMenuClass,
            searchMenuClass: productoMenuController.searchMenuClass,
            onClickCrear: () => { closeAllSubMenus(); productoMenuController.onClickCrear() },
            onClickSearch: () => { closeAllSubMenus(); productoMenuController.onClickSearch() },
            onClick: () => { closeAll(); productoMenuController.onClick() },
            to: {
                create: "/product/create/",
                search: "/product/search/"
            }
        }
    }

    const getPrincipalProps = () => {
        return {
            className: principalClass,
            onClick: () => { closeAll(); setPrincipalClass("menuOpen") },
            to: "/",
        }
    }

    return {
        principalClass,
        usuarioMenuController,
        roleMenuController,
        servicioMenuController,
        productoMenuController,
        closeAll,
        onClickPrincipal,
        usuarioMenuProps: getUsuarioMenuProps(),
        pricipalMenuProps: getPrincipalProps(),
        roleMenuProps: getRoleMenuProps(),
        serviceMenuProps: getServiceMenuProps(),
        productoMenuProps: getProductMenuProps(),
    }
}