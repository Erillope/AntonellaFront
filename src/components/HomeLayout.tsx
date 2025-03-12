import { SideBar } from "../components/SideBar"
import { Outlet } from "react-router-dom";
import Button from '@mui/material/Button';
import "../styles/homeLayout.css";
import icon from "../assets/antonella_logo.png";
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const HomeLayout = () => {
    const logOut = () => {
        Cookies.remove('user');
        window.location.reload();
    }

    const showConfirmLogOutMessage = () => {
        Swal.fire({
            title: "¿Estás seguro que deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut();
            }
        });
    }

    return (
        <div className="homeLayoutContainer">
            <div className="topCanvas">
                <img src={icon} width = "8%" height = "100%" style={{float: "left"}}/>
                <div style={{float: "right", paddingRight: "20px", paddingTop: "15px"}}>
                    <Button className="logout-button" onClick={showConfirmLogOutMessage}>
                        <LogoutIcon style={{color: "white"}}/></Button>
                </div>
            </div>
            <div className="viewContainer">
                <SideBar />
                <div style={{backgroundColor: 'white', width: '100%', boxSizing: 'border-box', paddingLeft: '20px', paddingRight: '20px', overflowY: 'auto', paddingBottom: '20px'}}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}