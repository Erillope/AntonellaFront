import { Outlet } from 'react-router-dom';
import icon from "../assets/antonella_logo.png";
import "../styles/login.css";

export const AuthLayout = () => {
    return (
        <div className="container">
            <div className="right">
                <img src={icon} className="logo" />
                <Outlet />
            </div>
        </div>
    )
}