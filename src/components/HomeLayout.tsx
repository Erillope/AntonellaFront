import { SideBar } from "../components/SideBar"
import { Outlet } from "react-router-dom";
import Button from '@mui/material/Button';
import "../styles/homeLayout.css";
import icon from "../assets/antonella_logo.png";
import LogoutIcon from '@mui/icons-material/Logout';
import { confirmLogOutMessage } from "../utils/alerts";
import Cookies from "js-cookie";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Box, IconButton } from '@mui/material';

export const HomeLayout = () => {
    const logOut = () => {
        Cookies.remove('user');
        window.location.reload();
    }
    
    return (
        <Box className="homeLayoutContainer">
            <TopCanvas logOut={logOut} />
            <Box className="viewContainer">
                <SideBar />
                <Content/>
            </Box>
        </Box>
    )
}


function TopCanvas(props: { logOut: () => void }) {
    return (
        <Box className="topCanvas">
            <Box style={{ width: '60px', height: "90%", float: "left", paddingLeft: "20px" }}>
                <Avatar src={icon} sx={{ width: '100%', height: '100%', borderRadius: 0 }} />
            </Box>
            <Box style={{ float: "right", paddingRight: "20px", paddingTop: "5px" }}>
                <Button className="logout-button" onClick={() => confirmLogOutMessage(props.logOut)}>
                    <LogoutIcon style={{ color: "white" }} /></Button>
            </Box>
        </Box>
    )
}

function Content() {
    return (
        <Box className="content">
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton style={{ color: '#F44565' }} onClick={() => window.history.back()}>
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