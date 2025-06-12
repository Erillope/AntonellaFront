import { SideBar } from "../components/SideBar"
import { Outlet } from "react-router-dom";
import Button from '@mui/material/Button';
import "../styles/homeLayout.css";
import icon from "../assets/antonella_logo.png";
import LogoutIcon from '@mui/icons-material/Logout';
import { confirmLogOutMessage } from "../utils/alerts";
import Cookies from "js-cookie";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { AuthUserApi } from "../api/user_api";

export const HomeLayout = () => {
    const userApi = new AuthUserApi();
    const loggedUser = userApi.getLoggedUser();

    const logOut = () => {
        Cookies.remove('user');
        window.location.reload();
    }
    
    return (
        <Box className="homeLayoutContainer">
            <TopCanvas logOut={logOut} userName={loggedUser?.name}/>
            <Box className="viewContainer">
                <SideBar />
                <Content/>
            </Box>
        </Box>
    )
}


function TopCanvas(props: { logOut: () => void, userName?: string }) {
    return (
        <Box className="topCanvas">
            <Box style={{ width: '60px', height: "90%", float: "left", paddingLeft: "20px" }}>
                <Avatar src={icon} sx={{ width: '100%', height: '100%', borderRadius: 0 }} />
            </Box>
            <Typography style={{ float: "left", paddingLeft: "20px", paddingTop: "16px", color: "white", fontStyle: "italic", fontSize: '15px' }}>Logueado como: {props.userName}</Typography>
            <Box style={{ float: "right", paddingRight: "20px", paddingTop: "5px" }}>
                <Button className="logout-button" onClick={() => confirmLogOutMessage(props.logOut)}>
                    <LogoutIcon style={{ color: "white" }} /></Button>
            </Box>
        </Box>
    )
}

function Content() {
    const handleBack = () => {
        if (window.location.pathname.endsWith("create/")){
            if (window.confirm("¿Estás seguro de que quieres salir? Se perderán los cambios realizados.")){
                window.history.back();
            }
        }
        else {
            window.history.back();
        }
    }

    return (
        <Box className="content">
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton style={{ color: '#F44565' }} onClick={handleBack}>
                    <ArrowBackIcon style={{ fontSize: "40px" }} />
                </IconButton>
                <h3 style={{ fontSize: "20px" }}>Volver</h3>
            </Box>
            <Box style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
                <Outlet />
            </Box>
        </Box>
    )
}