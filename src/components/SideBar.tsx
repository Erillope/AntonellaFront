import { useState } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { ExpandLess, ExpandMore, Person } from "@mui/icons-material";
import "../styles/sideBar.css";

export const SideBar = () => {
    const [principalClass, setPrincipalClass] = useState("menuOpen");
    const [usuariosClass, setUsuariosClass] = useState("menuClose");
    const [usuarioMenuOpen, setUsuarioMenuOpen] = useState(false);
    const [userIconColor, setUserIconColor] = useState("#37474F");

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

    const closeAll = () => {
        setPrincipalClass("menuClose");
        setUsuariosClass("menuClose");
        setUsuarioMenuOpen(false);
        setUserIconColor("#37474F");
    }

    return (
        <div style={{ width: 250, height: "100%", backgroundColor: 'white'}}>
            <List sx={{ width: 250, bgcolor: "white", color: "#37474F" }}>
                <ListItemButton  className={principalClass} onClick={onClickPrincipal}
                component={Link} to="/">
                    <ListItemText primary="Principal" />
                </ListItemButton>

                <ListItemButton onClick={onClickUsuarios} className={usuariosClass}>
                    <ListItemIcon>
                        <Person style={{ color: userIconColor }} />
                    </ListItemIcon>
                    <ListItemText primary="Usuarios"/>
                    {usuarioMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={usuarioMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{bgcolor: "#EBEDEE" }}>
                        <ListItemButton component={Link} to="/user/create/">
                            <ListItemText primary="Crear" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/user/search/">
                            <ListItemText primary="Consultar" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    );
}